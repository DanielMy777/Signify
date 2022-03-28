import {SignifyDetectionAnalyzer,SignifyWebDetectionModel} from './detectionModel'
import {ip,port} from '../secrets'
let DEFAULT_MODEL = new SignifyDetectionAnalyzer(new SignifyWebDetectionModel(ip,port))
module.exports={DEFAULT_MODEL:DEFAULT_MODEL}