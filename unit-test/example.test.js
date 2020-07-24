const exampleRepo = require('../app/repository/example')

test('test object inside array',()=>{
  expect([
    {
      nama : 'aktiva',
      nomor_kelompok : '01',
      posisi : 'debit'
    },
    {
      nama : 'passiva',
      nomor_kelompok : '02',
      posisi : 'credit'
    }
  ])
  .toContainEqual(
    expect.objectContaining({
      nama : 'passiva',
      nomor_kelompok : '02',
      posisi : 'credit'
    }),
    expect.objectContaining({
      nama : 'passiva',
      nomor_kelompok : '02',
      posisi : 'credit'
    })
  );
})

test('test object inside array',()=>{
  expect(
    {
      deleted : [
        {
          "nama" : 'aji'
        }
      ]
    }
  )
  .toEqual(
    expect.objectContaining({
      deleted : expect.arrayContaining([
        expect.objectContaining({
          "nama" : 'aji'
        })
      ]) 
    }),
    
  );
})