import moment from 'moment';

const time = "13:00:00";

const AMPM = moment(time, "HH:mm:ss").format("hh:mm A");

console.log(AMPM);

