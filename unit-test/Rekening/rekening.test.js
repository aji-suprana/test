require('dotenv/config');
var flavver = require('flaverr')
const rekeningRepo = require('../../app/repositories/rekening');
const jenisRekeningRepo = require('../../app/repositories/jenis_rekening');
const subkelompokRepo = require('../../app/repositories/sub_kelompok');
const kelompokRepo = require('../../app/repositories/kelompok');

const db = require('../../app/models');

async function cleanUpDatabase(){
  await db.Rekening.destroy({truncate : true})
  await db.Jenis_Rekening.destroy({truncate : true})
  await db.Sub_Kelompok.destroy({truncate : true})
  await db.Kelompok.destroy({truncate : true})
}

var kelompok = null;
var sub_kelompok1 = null;
var jenis_rekening1 = null;
var jenis_rekening2 = null;


afterAll(async () => {
  await cleanUpDatabase();
});

beforeEach(async () => {
  cleanUpDatabase();
  kelompok = await kelompokRepo.CreateKelompok({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'aktiva',
      nomor_kelompok : 1,
      posisi : 'debit'
    }
  });

  sub_kelompok1 = await subkelompokRepo
  .Create({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'kas-bank',
      nomor_sub_kelompok : 1,
      kelompok_id : kelompok.id
    }
  })

  jenis_rekening1 = await jenisRekeningRepo
  .Create({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'kas-besar',
      nomor_jenis_rekening : 1,
      sub_kelompok_id : jenis_rekening.id
    }
  })

  jenis_rekening2 = await jenisRekeningRepo
  .Create({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'kas-kecil',
      nomor_jenis_rekening : 2,
      sub_kelompok_id : sub_kelompok1.id
    }
  })
});

////////////////////////////////////////////////////////////////////
// Create Jenis Rekening
describe('Rekening.Create()', () => {
  beforeEach(async()=>{
    await db.Rekening.destroy({truncate : true})
  })

  //Case 0 if admin, isdefault = true
  test('succesfully created',()=>{
    expect(rekeningRepo
      .Create({
        headers:{
          'isAdmin' : true
        },
        body : {
          nama : 'kas-senjoyo',
          nomor_rekening : 1,
          jenis_rekening_id : jenisRekening1.id
        }
      })
    )
    .toEqual(
      expect.objectContaining({
        nama : 'kas-senjoyo',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id,
        brand_id : null,
        isDefault : true
      })
    );
  })

  //Case 0.1 if not admin, isdefault = falses
  test('succesfully created',()=>{
    var req = {
      headers:{
        brand_id: "test-brand-id"
      },
      body : {
        nama : 'kas-brajan',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id,
      }
    }

    expect(rekeningRepo.Create(req))
    .toEqual(
      expect.objectContaining({
        nama : req.nama,
        nomor_rekening : req.nomor_rekening,
        jenis_rekening_id : jenisRekening1.id,
        brand_id : req.headers["brand_id"],
        isDefault : false
      })
    );
  })

  //Case 1: (TODO) can't create same name in same sub_kelompok
  //Case 2: (TODO) can't create same nomor_kelompok in same sub_kelompok
  //Case 3: (TODO) can't create nomor_jenis_rekening > 99 || < 0
  //Case 4: (TODO) if not admin, have tohave brand-id

});

////////////////////////////////////////////////////////////////////
// Find One Jenis Rekening
describe('Rekening.FindOne()', () => {
  var createdKelompok = null;
  beforeEach(async()=>{
    await db.Rekening.destroy({truncate : true})
    await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      }
    })

    await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test2',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id
      }
    })
  })

  //Case 0
  test('succesfully found one',()=>{
    var req = {
      query : {
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      }
    }
    
    expect(rekeningRepo.FindOne(req))
    .toEqual(
      expect.objectContaining({
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      })
    );
  })

  //Case 1: TODO find using query.nama
  //Case 2: TODO find using query.nomor_kelompok
  //Case 3: TODO find using query.nama & query.nomor_kelompok
  //Case 4: TODO find using query.id
  //Case 5: TODO query doesnt exist in database return status true with empty data  []
});

////////////////////////////////////////////////////////////////////
// Find All Jenis Rekening
describe('Rekening.FindAll()', () => {
  beforeEach(async()=>{
    await db.Rekening.destroy({truncate : true})
    await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      }
    })

    await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test2',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id
      }
    })
  })

  //Case 0
  test('succesfully found all',()=>{
    var req = {
      query : {}
    }
    
    expect(rekeningRepo.FindMany(req))
    .toContainEqual(
      expect.objectContaining({
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenis_rekening1.id
      }),

      expect.objectContaining({
        nama : 'test2',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id
      })
    );
  })

  //Case 1: TODO find using query.nama
  //Case 2: TODO find using query.nomor_kelompok
  //Case 3: TODO find using query.nama & query.nomor_kelompok
  //Case 4: TODO find using query.id
  //Case 5: TODO query doesnt exist in database return status true with empty data  []
});

////////////////////////////////////////////////////////////////////
// Update Rekening
describe('Sub_Kelompok.Update()', () => {
  var toUpdate1 = null;
  var toUpdate2 = null;
  var toUpdate3 = null;
  var toUpdate4 = null;


  beforeEach(async()=>{
    await db.Rekening.destroy({truncate : true})
    toUpdate1 = await rekeningRepo.Create({
      headers:{
        brand_id : "test-brand-id-1"
      },
      body : {
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      }
    })

    toUpdate2 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test2',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id
      }
    })

    toUpdate3 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test3',
        nomor_rekening : 3,
        jenis_rekening_id : jenis_rekening1.id
      }
    })

    toUpdate4 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test4',
        nomor_rekening : 4,
        jenis_rekening_id : jenis_rekening1.id
      }
    })
  })

  //Case 0: admin can update any
  test('succesfully update',()=>{
    var req = {
      headers:{
        isAdmin : true
      },
      query:{
        id : toUpdate1.id
      },
      body:{
        nama : 'hutang-dagang',
        nomor_kelompok : 3,
      }
    }

    expect(kelompokRepo.Update(req))
    .toEqual(
      expect.objectContaining({
        nama : 'hutang-dagang',
        nomor_kelompok : 3,
        id : toUpdate1.id
      })
    );
  })

  //Case 0.0 custom rekening can only be updated if user have brand-id
  test('succesfully update',()=>{
    var req = {
      user:{
        brand_id:[
          "test-brand-id-1",
          "test-brand-id-2"
        ]
      },
      query:{
        id : toUpdate1.id
      },
      body:{
        nama : 'test-udpate',
        nomor_kelompok : 3,
      }
    }

    expect(kelompokRepo.Update(req))
    .toEqual(
      expect.objectContaining({
        nama : 'test-udpate',
        nomor_kelompok : 3,
        id : toUpdate1.id
      })
    );
  })
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
  //Case 8 : Test non-authorized calls (no brand id or not an admin)
});

////////////////////////////////////////////////////////////////////
// Delete Rekening
describe('Rekening.Delete()', () => {
  var toDelete1 = null;
  var toDelete2 = null;
  var toDelete3 = null;
  var toDelete4 = null;


  beforeEach(async()=>{
    await db.Rekening.destroy({truncate : true})
    toDelete1 = await rekeningRepo.Create({
      headers:{
        brand_id : "test-brand-id-1"
      },
      body : {
        nama : 'test1',
        nomor_rekening : 1,
        jenis_rekening_id : jenisRekening1.id
      }
    })

    toDelete2 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test2',
        nomor_rekening : 2,
        jenis_rekening_id : jenis_rekening1.id
      }
    })

    toDelete3 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test3',
        nomor_rekening : 3,
        jenis_rekening_id : jenis_rekening1.id
      }
    })

    toDelete4 = await rekeningRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'test4',
        nomor_rekening : 4,
        jenis_rekening_id : jenis_rekening1.id
      }
    })
  })

  //Case 0: admin can delete any
  test('succesfully delete',()=>{
    var req = {
      headers:{
        isAdmin : true
      },
      query:{
        id : toDelete.id
      }
    }

    expect(kelompokRepo.Delete(req))
    .toContainEqual(
      expect.objectContaining({
        nama : toDelete1.nama,
        nomor_rekening : toDelete1.nomor_rekening,
        id : toDelete1.id
      })
    );
  })

  //Case 0.0 custom rekening can only be updated if user have brand-id
  test('succesfully delete',()=>{
    var req = {
      user:{
        brand_id:[
          "test-brand-id-1",
          "test-brand-id-2"
        ]
      },
      query:{
        id : toUpdate1.id
      },
      body:{
        nama : 'test-udpate',
        nomor_kelompok : 3,
      }
    }

    expect(kelompokRepo.Delete(req))
    .toContainEqual(
      expect.objectContaining({
        nama : toDelete1.nama,
        nomor_rekening : toDelete1.nomor_rekening,
        id : toDelete1.id
      })
    )
  })
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
  //Case 8 : Test non-authorized calls (no brand id or not an admin)
});