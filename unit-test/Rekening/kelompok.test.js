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
var kelompok2 = null;

afterAll(async () => {
  await cleanUpDatabase();
});

beforeEach(async () => {
  cleanUpDatabase();
});


////////////////////////////////////////////////////////////////////
// Create Kelompok
describe('Kelompok.Create()', () => {
  beforeEach(async()=>{
    await db.Kelompok.destroy({truncate : true})
  })

  //Case 0
  test('succesfully created',()=>{
    expect(kelompokRepo
      .Create({
        headers:{
          'isAdmin' : true
        },
        body : {
          nama : 'aktiva',
          nomor_kelompok : 1,
          posisi : 'debit'
        }
      })
    )
    .toEqual(
      expect.objectContaining({
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      })
    );
  })

  //Case 1: (TODO) can't create same name
  //Case 2: (TODO) can't create same nomor_kelompok
  //Case 3: (TODO) can't create nomor_kelompok > 99 || < 0
  //Case 4: < (TODO) Only Admin Can Create
});

////////////////////////////////////////////////////////////////////
// Find One Kelompok
describe('Kelompok.FindOne()', () => {
  var createdKelompok = null;
  beforeAll(async()=>{
    await db.Kelompok.destroy({truncate : true})
    await kelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      }
    })

    await kelompokRepo
    .Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'passiva',
        nomor_kelompok : 2,
        posisi : 'debit'
      }
    })
  })

  //Case 0
  test('succesfully found one',()=>{
    var req = {
      query : {
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      }
    }
    
    expect(kelompokRepo.FindOne(req))
    .toEqual(
      expect.objectContaining({
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      })
    );
  })

   //Case 1: TODO find using query.nama
  //Case 2: TODO find using query.nomor_kelompok
  //Case 3: TODO find using query.nama & query.nomor_kelompok
  //Case 4: TODO find using query.id
  //Case 5: TODO query doesnt exist in database return status true with empty data  []
})

////////////////////////////////////////////////////////////////////
// Find Many Kelompok
describe('Kelompok.FindMany()', () => {
  beforeAll(async()=>{
    await db.Kelompok.destroy({truncate : true})
    await kelompokRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      }
    })

    await kelompokRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'passiva',
        nomor_kelompok : 2,
        posisi : 'debit'
      }
    })
  })

  //Case 0
  test('succesfully found many',()=>{
    var req = {}

    expect(kelompokRepo.FindMany(req))
    .toContainEqual(
      expect.objectContaining({
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      }),

      expect.objectContaining({
        nama : 'passiva',
        nomor_kelompok : 2,
        posisi : 'debit'
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
// Update Kelompok
describe('Kelompok.Update()', () => {
  var toUpdate = null;
  beforeAll(async()=>{
    await db.Kelompok.destroy({truncate : true})
    toUpdate = await kelompokRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
      }
    })

    await kelompokRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'passiva',
        nomor_kelompok : 2,
        posisi : 'debit'
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
        id : toUpdate.id
      },
      body:{
        nama : 'pendapatan penjualan',
        nomor_kelompok : 4,
        posisi : 'kredit'
      }
    }
    

    expect(kelompokRepo.Update(req))
    .toEqual(
      expect.objectContaining( {status : false, err:{code: 'E_NOT_IMPLEMENTED'}})
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
describe('Kelompok.Delete()', () => {
  var toDelete = null;
  beforeAll(async()=>{
    await db.Kelompok.destroy({truncate : true})
    toDelete = await kelompokRepo.Create({
      headers:{
        'isAdmin' : true
      },
      body : {
        nama : 'aktiva',
        nomor_kelompok : 1,
        posisi : 'debit'
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
      kelompokRepo.Delete(req)
    )
    .toEqual(
      expect.objectContaining({
        deleted : expect.arrayContaining([
          expect.objectContaining({
            "id" : toDelete.id
          })
        ]) 
      }),
    );
  })

  //Case 1: TODO delete using query.nama
  //Case 2: TODO delete using query.nomor_kelompok
  //Case 3: TODO delete using query.nama & query.nomor_kelompok
  //Case 4: TODO delete using query.id
  //Case 5: TODO kelompok.id == query.id doesnt exist
  //Case 6: TODO query.nama doesnt exist in database
  //Case 7 : TODO query.nomor_kelompok doesnt exist
});




