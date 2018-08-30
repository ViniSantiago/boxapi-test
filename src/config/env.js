exports.Env = {
    app: {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    },
    db: {
      url: process.env.MONGO_URL || 'mongodb://box-mongo-db:27017/box',
      pwd: process.env.MONGO_PWD,
      user: process.env.MONGO_USER,
    },
    server: {
      port: process.env.API_PORT || 3443,
    },
    kernel:{
        authorization: process.env.KERNEL_AUTHORIZATION  || 'nUgVsgTqYjvNd6EV6Ftmq7ZxYaEkM8Cl',
        url_kernel_account: process.env.KERNEL_ACCOUNT || 'https://10.254.0.118:8081/kernel/api/v0/accounts',
    }
};
  