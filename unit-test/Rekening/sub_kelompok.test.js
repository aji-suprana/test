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

var kelompok1 = null;
var kelompok2 = null;

afterAll(async () => {
  await cleanUpDatabase();
});

beforeEach(async () => {
  cleanUpDatabase();
  kelompok1 = await kelompokRepo.CreateKelompok({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'aktiva',
      nomor_kelompok : 1,
      posisi : 'debit'
    }
  });

  kelompok2 = await kelompokRepo.CreateKelompok({
    headers:{
      'isAdmin' : true
    },
    body : {
      nama : 'passiva-hutang',
      nomor_kelompok : 2,
      posisi : 'credit'
    }
  });
});

////////////////////////////////////////////////////////////////////
// Create Jenis Rekening
describe('Sub_Kelompok.Create()', () => {
  beforeEach(async()=>{
    await db.Sub_Kelompok.destroy({truncate : true})
  })

  //Case 0
  test('succesfully created',()=>{
    expect(subkelompokRepo
      .Create({
        headers:{
          'isAdmin' : true
        },
        body : {
          nama : 'kas-bank',
          nomor_sub_kelompok : 1,
          kelompok_id : kelompok1.id
        }
      })
    )
    .toEqual(
      expect.objectContaining({
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      })
    );
  })

  //Case 1: (TODO) can't create same name in same kelompok
  //Case 2: (TODO) can't create same nomor_kelompok in same kelompok
  //Case 3: (TODO) can't create nomor_kelompok > 99 || < 0
  //Case 4: < (TODO) Only Admin Can Create
});

////////////////////////////////////////////////////////////////////
// Find One Jenis Rekening
describe('Sub_Kelompok.FindOne()', () => {
  var createdKelompok = null;
  beforeAll(async()=>{
    await db.Sub_Kelompok.destroy({truncate : true})
    await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })

    await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })
  })

  //Case 0
  test('succesfully found one',()=>{
    var req = {
      query : {
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    }
    
    expect(kelompokRepo.FindOne(req))
    .toEqual(
      expect.objectContaining({
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
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
describe('Sub_Kelompok.FindAll()', () => {
  beforeAll(async()=>{
    await db.Sub_Kelompok.destroy({truncate : true})
    await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })

    await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })
  })

  //Case 0
  test('succesfully found all',()=>{
    var req = {
      query : {}
    }
    
    expect(subkelompokRepo.FindMany(req))
    .toContainEqual(
      expect.objectContaining({
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }),

      expect.objectContaining({
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
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
describe('Sub_Kelompok.Update()', () => {
  var toUpdate1 = null;
  var toUpdate2 = null;
  var toUpdate3 = null;
  var toUpdate4 = null;


  beforeEach(async()=>{
    await db.Sub_Kelompok.destroy({truncate : true})
    toUpdate1 = await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })

    toUpdate2 = await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'piutang-lancar',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })

    toUpdate3 = await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'hutang-dagang',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok2.id
      }
    })

    toUpdate4 = await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'hutang-cek-bg',
        nomor_sub_kelompok : 2,
        kelompok_id : kelompok2.id
      }
    })
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
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
});

////////////////////////////////////////////////////////////////////
// Delete Jenis Rekening
describe('Sub_Kelompok.Delete()', () => {
  var toDelete = null;

  beforeEach(async()=>{
    await db.Sub_Kelompok.destroy({truncate : true})
    toDelete = await subkelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'kas-bank',
        nomor_sub_kelompok : 1,
        kelompok_id : kelompok1.id
      }
    })
  })

  //Case 0
  test('succesfully update',()=>{
    var req = {
      headers:{
        isAdmin : true
      },
      query:{
        id : toDelete.id
      }
    }
    
    expect(
      subKelompokRepo.Delete(req)
    )
    .toEqual(
      expect.objectContaining({
        deleted : expect.arrayContaining([
          expect.objectContaining({
            "id" : toDelete.id,
            "nama" : toDelete.nama,
            "nomor_sub_kelompok" : toDelete.nomor_sub_kelompok
          })
        ]) 
      }),
    );
  })
  //Case 1: TODO update using query.nama
  //Case 2: TODO update using query.nomor_kelompok
  //Case 3: TODO update using query.nama & query.nomor_kelompok
  //Case 4: TODO update using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
});




