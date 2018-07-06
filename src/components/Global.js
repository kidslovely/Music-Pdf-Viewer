import Expo, {FileSystem,ImagePicker, SQLite} from 'expo'
export default {
    online: true,
    db_book : SQLite.openDatabase('book5.db'),
    db_music : SQLite.openDatabase('music6.db'),
    share_id :0,
    share_title :null,
    share_url:null,
    share_filepath:null,
    share_navigate : null,
    };