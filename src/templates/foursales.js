// Template Foursales — Figma node 1:86 (1200×1500 → 540×675, escala 0.45)
export const TEMPLATE_FOURSALES = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;500;700;800&family=Montserrat:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 540px;
    height: 675px;
    overflow: hidden;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .card {
    width: 540px;
    height: 675px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: radial-gradient(500px at 53% 54%, #051530 45%, #030b19 74%, #010101 100%);
  }

  .topbar {
    flex-shrink: 0;
    position: relative;
    height: 46px;
    margin-top: 20px;
  }

  .topbar svg.logo {
    position: absolute;
    left: 37px;
    top: 3px;
    width: 66px;
    height: 10px;
  }

  .topbar .slogan {
    position: absolute;
    left: 115px;
    right: 0;
    top: 0;
    text-align: center;
    font-size: 20.5px;
    font-weight: 300;
    color: #fff;
    line-height: normal;
    white-space: nowrap;
  }

  .topbar .slogan strong {
    font-weight: 700;
  }

  .header {
    flex-shrink: 0;
    padding: 0 27px;
    text-align: left;
  }

  .cargo {
    font-size: 46px;
    font-weight: 700;
    color: #bf9f59;
    line-height: normal;
  }

  .subtitulo {
    font-size: 27px;
    font-weight: 300;
    color: #fff;
    line-height: normal;
    margin-top: 8px;
    white-space: nowrap;
  }

  .header-divider {
    flex-shrink: 0;
    height: 11px;
    background: #bf9f59;
    margin: 10px 0 0 30px;
  }

  .foto-area {
    flex-shrink: 0;
    width: 100%;
    height: 205px;
    overflow: hidden;
    box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  }

  .foto-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 22%;
    display: block;
  }

  .footer {
    flex: 1;
    display: flex;
    padding: 24px 20px 8px;
    gap: 11px;
    overflow: hidden;
  }

  .col {
    min-width: 0;
  }

  .col-left  { flex: 60; padding-left: 10px; }
  .col-right { flex: 40; }

  .col-title {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 22.5px;
    font-weight: 700;
    color: #bf9f59;
    margin-bottom: 9px;
  }

  .col-item {
    display: list-item;
    list-style: disc outside;
    margin-left: 14px;
    font-family: 'Montserrat', sans-serif;
    font-size: 21.5px;
    font-weight: 400;
    color: #fff;
    line-height: 1;
    margin-bottom: 11px;
  }

  .col-item:last-child {
    margin-bottom: 0;
  }

  .cta {
    flex-shrink: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 277px;
    height: 42px;
    border-radius: 21px;
    background: #b90d2a;
    margin-bottom: 17px;
  }

  .cta span {
    font-family: 'Montserrat', sans-serif;
    font-size: 21.5px;
    font-weight: 400;
    color: #fff;
    line-height: 1;
  }
</style>
</head>
<body>
<div class="card">

  <div class="topbar">
    <svg class="logo" viewBox="0 0 147 21" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M79.875 0H142.5V21H79.875V0Z" fill="url(#fsg0)"/>
      <path d="M0 5.15789H5.25V15.8421H0V5.15789Z" fill="url(#fsg1)"/>
      <path d="M77.25 4.05263H35.625V16.9474H74.9221L77.25 4.05263Z" fill="url(#fsg2)"/>
      <path d="M7.5 6.63158H33.1875L30.8658 14.3684H7.5V6.63158Z" fill="url(#fsg3)"/>
      <path d="M147 3.68421C147 2.46337 145.993 1.47368 144.75 1.47368V19.5263C145.993 19.5263 147 18.5366 147 17.3158V3.68421Z" fill="url(#fsg4)"/>
      <defs>
        <linearGradient id="fsg0" x1="0" y1="10.5" x2="147" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0E2D" stop-opacity="0.5"/><stop offset="1" stop-color="#CE0E2D"/></linearGradient>
        <linearGradient id="fsg1" x1="0" y1="10.5" x2="147" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0E2D" stop-opacity="0.5"/><stop offset="1" stop-color="#CE0E2D"/></linearGradient>
        <linearGradient id="fsg2" x1="0" y1="10.5" x2="147" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0E2D" stop-opacity="0.5"/><stop offset="1" stop-color="#CE0E2D"/></linearGradient>
        <linearGradient id="fsg3" x1="0" y1="10.5" x2="147" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0E2D" stop-opacity="0.5"/><stop offset="1" stop-color="#CE0E2D"/></linearGradient>
        <linearGradient id="fsg4" x1="0" y1="10.5" x2="147" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="#CE0E2D" stop-opacity="0.5"/><stop offset="1" stop-color="#CE0E2D"/></linearGradient>
      </defs>
    </svg>
    <p class="slogan">CHOOSE <strong>RIGHT</strong>. CHOOSE <strong>EXPERTS</strong>.</p>
  </div>

  <div class="header">
    <p class="cargo">{{CARGO}}</p>
    <p class="subtitulo">{{SUBTITULO}}</p>
  </div>

  <div class="header-divider"></div>

  <div class="foto-area">
    <img class="foto-img" src="{{FOTO_URL}}" alt="Profissional">
  </div>

  <div class="footer">
    <div class="col col-left">
      <span class="col-title">Requisitos:</span>
      {{REQUISITOS_HTML}}
    </div>
    <div class="col col-right">
      <span class="col-title">Benefícios</span>
      {{BENEFICIOS_HTML}}
    </div>
  </div>

  <div class="cta"><span>Clique e inscreva-se!</span></div>

</div>
<script>
  (function () {
    var scale = 1;
    var minScale = 0.55;
    var step = 0.02;
    var baseItemSize = 21.5, baseItemMargin = 11;
    var items = document.querySelectorAll('.col-item');
    var reqCol = document.querySelector('.col-left');
    var benCol = document.querySelector('.col-right');

    function apply(s) {
      for (var j = 0; j < items.length; j++) {
        items[j].style.fontSize = (baseItemSize * s) + 'px';
        items[j].style.marginBottom = (baseItemMargin * s) + 'px';
      }
    }

    function overflows() {
      return reqCol.scrollHeight > reqCol.clientHeight || benCol.scrollHeight > benCol.clientHeight;
    }

    function fitNowrap(el, baseSize) {
      if (!el) return;
      var s = 1;
      while (s > 0.5 && el.scrollWidth > el.clientWidth) {
        s -= 0.02;
        el.style.fontSize = (baseSize * s) + 'px';
      }
    }

    function fitCargo() {
      var el = document.querySelector('.cargo');
      if (!el) return;
      var baseCargoSize = 46;
      var s = 1;
      el.style.whiteSpace = 'nowrap';
      while (s > 0.5 && el.scrollWidth > el.clientWidth) {
        s -= 0.02;
        el.style.fontSize = (baseCargoSize * s) + 'px';
      }
      if (el.scrollWidth > el.clientWidth) {
        el.style.whiteSpace = 'normal';
      }
    }

    function trimOverflow(col) {
      var colItems = col.querySelectorAll('.col-item');
      var i = colItems.length - 1;
      while (i >= 0 && col.scrollHeight > col.clientHeight) {
        colItems[i].style.display = 'none';
        i--;
      }
    }

    function shrink() {
      fitNowrap(document.querySelector('.subtitulo'), 27);
      fitCargo();
      // a lista mais longa ganha a coluna larga do design (60/40)
      if (benCol.textContent.length > reqCol.textContent.length) {
        reqCol.style.flex = '40';
        benCol.style.flex = '60';
      }
      apply(scale);
      // sobrou espaço → cresce a fonte até 1.3x (feedback: fonte pequena)
      while (scale < 1.3 && !overflows()) {
        scale += step;
        apply(scale);
      }
      while (scale > minScale && overflows()) {
        scale -= step;
        apply(scale);
      }
      // última defesa: fonte no mínimo e ainda estourando → corta itens do fim
      if (overflows()) {
        trimOverflow(reqCol);
        trimOverflow(benCol);
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(shrink);
    } else {
      shrink();
    }
  })();
</script>
</body>
</html>`
