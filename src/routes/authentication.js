const pool = require('../database');
const helpers = require('../lib/helpers');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

 
// SIGNUP GET
router.get('/signup', (req, res) => {

  return res.render('auth/signup', {mobile:"crear_cuenta.css", tablet:"empthy", desktop:"crear_Cuenta_desktop.css", componentes:"componentes.css"}); 
});

// SIGNUP POST
router.post('/signup', async (req, res) => {
  console.log(req.body);

var data = 
{
  id_usuario: req.body.id_usuario,
  correo_usuario: req.body.correo_usuario,
  nombres: req.body.nombres,
  apellidos: req.body.apellidos,
  telefono: req.body.telefono,
  password: req.body.password
}

const compare_id = await pool.query('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [data.id_usuario]);
const compare_email = await pool.query('SELECT correo_usuario FROM usuario WHERE correo_usuario = ?', [data.correo_usuario]);


if (data.password != req.body.confirmar_clave) 
{
  return res.render('auth/ro');
}

if (compare_id != '' || compare_email != '') 
{
  return res.render('auth/re');
} 
else
{
  data.password = await helpers.encryptPassword(data.password);
  console.log(data, ' <-este es data');
  const result =  pool.query('INSERT INTO usuario SET ? ', data);

  return res.redirect('./inicio_usuario');
}});



//SIGNIN GET 
router.get('/signin', (req, res) => {
  
  return res.render('auth/signin', {mobile:"iniciar_sesion.css", tablet:"empty.css", desktop:"Iniciar_Sesion_Desktop.css", componentes:"componentes.css"}); 
});

//SIGNIN POST
router.post('/signin', (req, res, next) => {

   
  console.log(req.body.correo_usuario, '  <- desde authentication');
  console.log(req.body.password, '  <- desde authentication');

  const email_request = req.body.correo_usuario;
  const correo_admin = 'cartama@10.com';

  if (correo_admin == email_request) 
  {
    passport.authenticate('local.signin', {
      successRedirect: '/admin_inicio',      
      failureRedirect: '/signin',

      failureFlash: true
    })(req, res, next);
  }
  else
  {
    passport.authenticate('local.signin', {
      successRedirect: '/inicio_usuario',   
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next);
  }
})





















//router.post('/signup', passport.authenticate('local.signup', {
//  successRedirect: '/profile',
//  failureRedirect: '/signup',
//  failureFlash: true
//}));

// // SINGIN//////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// router.get('/signin', (req, res) => {
//   res.render('auth/signin');
// });

// router.post('/signin', (req, res, next) => {

//   passport.authenticate('local.signin', {
//     successRedirect: '/profile',
//     failureRedirect: '/signin',
//     failureFlash: true
//   })(req, res, next);
// });

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

// router.get('/profile', isLoggedIn, (req, res) => {
//   res.render('profile');
// });
/////////////////////////////////////////////////////////////////////////signin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// const id_admin = { id_usuario: 1};
// if (req.body.id_usuario == id_admin.id_usuario) 
// { 
//   const query_id_admin = await pool.query('SELECT correo_usuario, password FROM usuario WHERE id_usuario = ?', [id_admin.id_usuario]); 
//   console.log(query_id_admin);
  
//   return res.send('ESTE TEXTO APARECE AL INGRESAR COMO ADMIN');
// }
/////////////////////////////////////////////////////////////////////////signin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




















passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
  const rows = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
  console.log(rows, '<----- deserializacion');
  done(null, rows[0]);
});


module.exports = router;