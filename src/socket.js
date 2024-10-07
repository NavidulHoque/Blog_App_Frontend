import io from 'socket.io-client';
import { url } from './url';

const socket = io.connect(url);
export default socket;