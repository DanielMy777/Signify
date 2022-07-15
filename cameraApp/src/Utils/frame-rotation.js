import {OrientationNames} from './OrentationNames';
const normal_rotation_obj = {};
normal_rotation_obj[OrientationNames.PORTRAIT] = 90;
normal_rotation_obj[OrientationNames.SELFI_PORTRAIT] = 270;
normal_rotation_obj[OrientationNames.LANDSCAPE_RIGHT] = 180;
normal_rotation_obj[OrientationNames.SELFI_UNKNOWN] = 270;
normal_rotation_obj[OrientationNames.UNKNOWN] = 90;

const portrait_locked_rotation_obj = {};

module.exports = {
  normal_rotation_obj,
  portrait_locked_rotation_obj,
};
