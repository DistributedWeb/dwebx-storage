var ddrive = require('ddrive')
var storage = require('./')

var archive = ddrive(storage('sandbox/my-dataset'), {latest: true})

archive.writeFile('/foo', 'this is foo')
archive.writeFile('/bar', 'this is bar')
archive.writeFile('/bar', 'this is bar updated')
archive.writeFile('/baz', 'this is baz', function () {
  archive.readFile('/foo', 'utf-8', function (err, buf) {
    if (err) throw err
    console.log(buf)
  })

  var clone = ddrive(storage('sandbox/my-dataset-clone'), archive.key, {sparse: true})
  var stream = archive.replicate()

  stream.pipe(clone.replicate()).pipe(stream)

  clone.metadata.update(function () {
    clone.readFile('/foo', console.log)
  })
})
