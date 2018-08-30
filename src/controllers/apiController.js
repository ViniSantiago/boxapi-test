"use strict";

var Util = require("util");
var request = require("request");
var uuid = require("node-uuid");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Product = mongoose.model("Product");
var Config = require("../config/env");
var Prometheus = require("prom-client");

// Prometheus Counter for API calls
const PrometheusMetrics = {
  requestCounter: new Prometheus.Counter({
    name: "box_api",
    help: "Number of routers call",
    labelNames: ["method", "path", "statusCode"]
  })
};

exports.welcome = function(req, res) {
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
  return res.json({
    box: "Projeto Box - Versão Inicial"
  });
};

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err) {
      res.json({ erro: { cod: 1, message: err } });
    }
    res.json({ succ: { data: user } });
  });
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};

exports.sign_up_user = function(req, res) {
  console.log("Sign_up Body\n" + Util.inspect(req.body, false, null));
  newUserValidation(req.body).then(
    function(resultValidation) {
      registerKernel(req.body).then(
        function(resultKernel) {
          req.body.userid = uuid.v4();
          req.body.kernelid = resultKernel;
          var new_user = new User(req.body);
          new_user.save(function(err, user) {
            if (err) {
              return res.json({ erro: { cod: 100, message: err } });
            } else {
              return res.json({ succ: { data: user } });
            }
          });
        },
        function(err) {
          // Erro registrando ID o Kernel
          return res.json(err);
        }
      );
    },
    function(err) {
      // Erro na validacao dos Dados
      return res.json(err);
    }
  );
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};

exports.get_me = function(req, res) {
  User.findOne({ email: req.body.email }, null, function(err, user) {
    if (err) {
      res.json({ erro: { cod: 1, message: err } });
    }
    res.json({ succ: { data: user } });
  });
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};

exports.delete_user = function(req, res) {
  User.findByIdAndRemove(req.body._id, (err, result) => {
    if (err) {
      res.json({
        erro: {
          cod: 1,
          message: "Falha ao excluir usuário com o _id: " + req.body._id
        }
      });
    } else {
      res.json({
        succ: { message: "Usuário excluído com sucesso", data: result }
      });
    }
  });
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};

function newUserValidation(_user) {
  /* Verifica existencia de mesmo email para outro usuario */
  return new Promise(function(resolve, reject) {
    User.findOne({ email: _user.email }, null, function(err, user) {
      if (err) {
        reject({
          erro: { cod: 200, message: "Falha ao validar email - " + err }
        });
      }
      if (user) {
        reject({
          erro: {
            cod: 1,
            message:
              "Email '" + _user.email + "' já cadastrado para outro usuário",
            userid: user.userid
          }
        });
      } else {
        resolve();
      }
    });
  });
}

function registerKernel(_user) {
  var _data = { owner: _user.userid };
  var _header = {
    "content-type": "application/json",
    authorization: Config.Env.kernel.authorization
  };

  return new Promise(function(resolve, reject) {
    request.post(
      {
        headers: _header,
        url: Config.Env.kernel.url_kernel_account,
        body: _data,
        strictSSL: false,
        timeout: 1500,
        json: true
      },
      function(erro, resp, body) {
        if (erro) {
          console.log("Erro ao chamar Kernel: " + erro);
          reject({
            erro: {
              cod: 300,
              message: "Erro ao registrar usuário no Kernel: " + erro
            }
          });
        } else {
          console.log("OK chamando Kernel: " + body.id);
          resolve(body.id);
        }
      }
    );
  });
}
exports.list_product = function(req, res) {
  Product.find({}, function(err, product) {
    if (err) {
      res.json({
        erro: { cod: 1, message: err }
      });
    }
    res.json({
      succ: { data: product }
    });
  });
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};

exports.create_product = function(req, res) {
  registerKernel(req.body).then(
    function(resultKernel) {
      req.body.kernelid = resultKernel;
      Product.create(
        {
          kernelid: req.body.kernelid,
          description: req.body.description,
          balance: 0,
          balanceAsString: "0",
          transaction: []
        },
        function(error, product) {
          if (error) {
            res.json({
              error: { cod: 1, message: error }
            });
          }
          res.json({
            succ: { data: product }
          });
        }
      );
    },
    function(err) {
      return res.json(err);
    }
  );
  PrometheusMetrics.requestCounter.inc({
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
};