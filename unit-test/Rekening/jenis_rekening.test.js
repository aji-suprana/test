require('dotenv/config');
var flavver = require('flaverr')
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
var sub_kelompok2 = null;

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

  sub_kelompok2 = await subkelompokRepo
  .Create({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'piutang-lancar',
      nomor_sub_kelompok : 2,
      kelompok_id : kelompok.id
    }
  })
});

////////////////////////////////////////////////////////////////////
// Create Jenis Rekening
describe('JenisRekening.Create()', () => {
  beforeEach(async()=>{
    await db.Jenis_Rekening.destroy({truncate : true})
  })

  //Case 0 if admin, isdefault = true can create any
  test('succesfully created',()=>{
    expect(jenisRekeningRepo
      .Create({
        headers:{
          'isAdmin' : true
        },
        body : {
          nama : 'kas-besar',
          nomor_sub_kelompok : 1,
          kelompok_id : sub_kelompok1.id
        }
      })
    )
    .toEqual(
      expect.objectContaining({
        nama : 'kas-besar',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id,
        isDefault : true
      })
    );
  })

  //Case 0.1 if not admin, isdefault = false, have to have brand-id
  //Case 1: (TODO) can't create same name in same sub_kelompok
  //Case 2: (TODO) can't create same nomor_kelompok in same sub_kelompok
  //Case 3: (TODO) can't create nomor_jenis_rekening > 99 || < 0
});

////////////////////////////////////////////////////////////////////
// Find One Jenis Rekening
describe('JenisRekening.FindOne()', () => {
  var createdKelompok = null;
  beforeAll(async()=>{
    await db.Jenis_Rekening.destroy({truncate : true})
    await jenisRekeningRepo.Create({
      user:
      {
        brand_id:[
          "abcd1234"
        ]
      },
      body : {
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id,
        brand_id : "abcd1234"
      }
    })

    await jenisRekeningRepo.Create({
      user: {
        brand_id:[
          "efgh5678"
        ]
      },
      body : {
        nama : 'test2',
        nomor_sub_kelompok : 2,
        kelompok_id : sub_kelompok1.id,
        brand_id : "abcd1234"
      }
    })
  })

  //Case 0
  test('succesfully found one',()=>{
    var req = {
      user:{
        brand_id:[
          "abcd1234"
        ]
      },
      query : {
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id
      }
    }
    
    expect(kelompokRepo.FindOne(req))
    .toEqual(
      expect.objectContaining({
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id
      })
    );
  })

  //Case 1: TODO find using query.nama
  //Case 2: TODO find using query.nomor_kelompok
  //Case 3: TODO find using query.nama & query.nomor_kelompok
  //Case 4: TODO find using query.id
  //Case 5: TODO query doesnt exist in database return status true with empty data  []
  //Case 6: shouldn't read entry from unauthorized brand_id
});

////////////////////////////////////////////////////////////////////
// Find All Jenis Rekening
describe('JenisRekening.FindAll()', () => {
  var createdKelompok = null;
  beforeAll(async()=>{
    await db.Jenis_Rekening.destroy({truncate : true})
    await jenisRekeningRepo.Create({
      user:
      {
        brand_id:[
          "abcd1234"
        ]
      },
      body : {
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id,
        brand_id : "abcd1234"
      }
    })

    await jenisRekeningRepo.Create({
      user: {
        brand_id:[
          "efgh5678"
        ]
      },
      body : {
        nama : 'test2',
        nomor_sub_kelompok : 2,
        kelompok_id : sub_kelompok1.id,
        brand_id : "efgh5678"
      }
    })
  })


  //Case 0 : only show
  test('succesfully found all',()=>{
    var req = {
      user: {
        brand_id:[
          "efgh5678"
        ]
      },
      query : {
        brand_id:[
          "efgh5678"
        ]
      }
    }
    
    expect(subkelompokRepo.FindMany(req))
    .toContainEqual(
      expect.objectContaining({
        nama : 'test2',
        nomor_sub_kelompok : 2,
        kelompok_id : sub_kelompok1.id
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
// Update Jenis Rekening
describe('Jenis Rekening.Update()', () => {
  var toUpdate1 = null;

  beforeEach(async()=>{
    await db.Jenis_Rekening.destroy({truncate : true})
    toUpdate1 = await jenisRekeningRepo.Create({
      user : {
        brand_id:[
          "test-brand",
          "test-brand-id-2"
        ]
      },
      query : {
        brand_id: "test-brand"
      },
      body : {
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id
      }
    })

    await jenisRekeningRepo.Create({
      user : {
        brand_id:[
          "test-brand",
          "test-brand-id-2"
        ]
      },
      query : {
        brand_id: "test-brand"
      },
      body : {
        nama : 'test2',
        nomor_sub_kelompok : 2,
        kelompok_id : sub_kelompok1.id
      }
    })

  //Case 0
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

  //Case 0.0 isDefault = false/ custom jenis rekening can only be updated if owned brand
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
  })
})

////////////////////////////////////////////////////////////////////
// Delete Jenis Rekening
describe('Sub_Kelompok.Delete()', () => {
  var toDelete = null;

  beforeEach(async()=>{
    await db.Jenis_Rekening.destroy({truncate : true})
    toDelete = await jenisRekeningRepo.Create({
      user : {
        brand_id:[
          "test-brand",
          "test-brand-id-2"
        ]
      },
      query : {
        brand_id: "test-brand"
      },
      body : {
        nama : 'test1',
        nomor_sub_kelompok : 1,
        kelompok_id : sub_kelompok1.id
      }
    })
  })

  //Case 0: only admin can delete default jenis_rekening
  test('succesfully update',()=>{
    var req = {
      headers:{
        isAdmin : true
      },
      query:{
        id : toDelete.id
      }
    }
    
    expect(jenisRekeningRepo.Delete(req))
    .toEqual(
      expect.objectContaining({
        deleted : expect.arrayContaining([
          expect.objectContaining({
            "id" : toDelete.id,
            "nama" : toDelete.nama,
            "nomor_jenis_rekening" : toDelete.nomor_jenis_rekening
          })
        ])
      }),
    )
  })
  //Case 0.1 : only brand owner can delete custom
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
});




