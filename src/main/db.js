import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app } from 'electron'

const STORE_PATH = path.join(app.getPath('userData'), 'default_user')

if (!fs.pathExistsSync(STORE_PATH)) {
  fs.mkdirpSync(STORE_PATH)
}

const adapter = new FileSync(path.join(STORE_PATH, 'data.json'))

const db = Datastore(adapter)
db._.mixin(LodashId)

if (!db.has('ideas').value()) {
  db.set('ideas', []).write()
}

export default db
