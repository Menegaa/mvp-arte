// Template EasyHire — Figma node 1:103 (1200×1500 → 540×675, escala 0.45)
export const TEMPLATE_EASYHIRE = `<!DOCTYPE html>
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
    background: #051530;
  }

  .header {
    flex-shrink: 0;
    padding: 26px 27px 0;
    text-align: left;
  }

  .header-line1 {
    font-size: 26px;
    font-weight: 300;
    color: #fff;
    line-height: normal;
    margin-bottom: 10px;
    white-space: nowrap;
  }

  .header-line1 strong {
    font-weight: 700;
  }

  .cargo-badge {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #10df8b;
    border-radius: 999px;
    width: 486px;
    height: 55px;
    padding: 0 22px;
  }

  .cargo-badge span {
    display: block;
    font-size: 42px;
    font-weight: 700;
    color: #fff;
    line-height: normal;
    text-align: left;
  }

  .subtitulo {
    font-size: 27px;
    font-weight: 300;
    color: #fff;
    line-height: normal;
    margin-top: 9px;
    white-space: nowrap;
  }

  .header-divider {
    flex-shrink: 0;
    height: 11px;
    background: #06255b;
    margin: 10px 0 0 30px;
  }

  .foto-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .foto-area {
    width: 100%;
    height: 192px;
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

  .foto-peek {
    position: absolute;
    left: 0;
    bottom: -12px;
    width: 81%;
    height: 12px;
    background: #fff;
  }

  .footer {
    flex: 1;
    display: flex;
    padding: 18px 20px 6px;
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
    color: #10df8b;
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
    background: #0dcd7f;
    margin-bottom: 18px;
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

  <div class="header">
    <p class="header-line1">Trabalhe na <strong>{{EMPRESA}}</strong> com a <strong>EasyHire</strong></p>
    <div class="cargo-badge">
      <span>{{CARGO}}</span>
    </div>
    <p class="subtitulo">{{SUBTITULO}}</p>
  </div>

  <div class="header-divider"></div>

  <div class="foto-wrap">
    <div class="foto-area">
      <img class="foto-img" src="{{FOTO_URL}}" alt="Profissional">
    </div>
    <div class="foto-peek"></div>
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
      var span = document.querySelector('.cargo-badge span');
      if (!span) return;
      var baseCargoSize = 42;
      var cargoScale = 1;
      span.style.whiteSpace = 'nowrap';
      while (cargoScale > 0.5 && span.scrollWidth > span.clientWidth) {
        cargoScale -= 0.02;
        span.style.fontSize = (baseCargoSize * cargoScale) + 'px';
      }
      if (span.scrollWidth > span.clientWidth) {
        span.style.whiteSpace = 'normal';
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
      fitNowrap(document.querySelector('.header-line1'), 26);
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
