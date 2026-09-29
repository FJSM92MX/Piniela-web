/* Piniela · invitación a quiniela (/join/<id>?pin=<pin>). JavaScript propio, sin librerías.
   Lee el id de la ruta (o de ?id=) y el PIN de ?pin=, y solo escribe texto con textContent.
   Réplica de la guía de WPCode (join-guide-snippet.php): id solo dígitos, PIN solo letras, números y guion. */
(function () {
	'use strict';
	var ruta = window.location.pathname || '';
	var enJoin = /^\/join(\/|$)/i.test(ruta);
	var bloqueInvitacion = document.getElementById('invitacion');
	var bloqueNoEncontrada = document.getElementById('no-encontrada');
	if (!bloqueInvitacion) return;
	// En 404.html solo actuamos si la ruta es /join/...
	if (bloqueNoEncontrada && !enJoin) return;

	var params;
	try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
	var leer = function (k) { return params ? (params.get(k) || '') : ''; };

	var m = ruta.match(/^\/join\/(\d{1,12})\/?$/i);
	var id = m ? m[1] : leer('id').replace(/\D/g, '').slice(0, 12);
	var pin = leer('pin').replace(/[^A-Za-z0-9-]/g, '').slice(0, 16);

	if (bloqueNoEncontrada) {
		bloqueNoEncontrada.hidden = true;
		bloqueInvitacion.hidden = false;
		document.title = 'Únete a tu quiniela | Piniela';
	}

	var $ = function (sel) { return bloqueInvitacion.querySelector(sel); };
	var privada = $('[data-si="privada"]');
	var publica = $('[data-si="publica"]');
	var pinTexto = $('[data-pin]');
	var pasoPin = $('[data-paso-pin]');
	var enlaces = bloqueInvitacion.querySelectorAll('[data-abrir-app]');
	var sinId = $('[data-sin-id]');

	if (pin) {
		if (privada) privada.hidden = false;
		if (publica) publica.hidden = true;
		if (pinTexto) pinTexto.textContent = pin;
		if (pasoPin) pasoPin.textContent = 'Ingresa el PIN ' + pin + ' y entra a la quiniela.';
	} else {
		if (privada) privada.hidden = true;
		if (publica) publica.hidden = false;
		if (pasoPin) pasoPin.textContent = 'Es pública: solo tócala y elige Unirme (sin PIN).';
	}

	var i;
	if (id) {
		var destino = 'lapiniela://join/' + id + (pin ? '?pin=' + encodeURIComponent(pin) : '');
		for (i = 0; i < enlaces.length; i++) {
			enlaces[i].setAttribute('href', destino);
			enlaces[i].hidden = false;
		}
		if (sinId) sinId.hidden = true;
	} else {
		for (i = 0; i < enlaces.length; i++) enlaces[i].hidden = true;
		if (sinId) sinId.hidden = false;
	}
})();
