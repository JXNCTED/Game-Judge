const backendIP = '10.89.51.52';
// const backendIP = 'localhost';

const ServerList = {
    'view': `ws://${backendIP}:5555`,
    'judge-m': `ws://${backendIP}:4444`,
    'judge-w': `ws://${backendIP}:3333`,
    'judge-b': `ws://${backendIP}:2222`,
}

export default ServerList