// Template Moderno — conceito próprio (não vem do Figma): foto full-bleed com
// degradê navy, cartões translúcidos ("glass") e CTA em degradê. Usa {{UNIDADE}}
// no chip do topo, então serve para qualquer recruiting company.
export const TEMPLATE_MODERNO = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;500;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 540px;
    height: 675px;
    overflow: hidden;
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .card {
    position: relative;
    width: 540px;
    height: 675px;
    overflow: hidden;
    background: {{COR_FUNDO}};
  }

  .foto-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      color-mix(in srgb, {{COR_FUNDO}} 32%, transparent) 0%,
      color-mix(in srgb, {{COR_FUNDO}} 45%, transparent) 30%,
      color-mix(in srgb, {{COR_FUNDO}} 88%, transparent) 55%,
      {{COR_FUNDO}} 72%);
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 22px 24px;
  }

  .chip {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 8px;
    background: color-mix(in srgb, {{COR_FUNDO}} 45%, transparent);
    border: 1.5px solid rgba(255, 255, 255, 0.55);
    border-radius: 999px;
    padding: 7px 16px;
    backdrop-filter: blur(6px);
  }

  .chip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: {{COR_ACENTO}};
  }

  .chip span {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #fff;
  }

  .spacer { flex: 1; }

  .eyebrow {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: {{COR_ACENTO}};
    margin-bottom: 6px;
  }

  .cargo {
    font-size: 42px;
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  }

  .subtitulo {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 19px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.88);
    margin-top: 7px;
    white-space: nowrap;
  }

  .subtitulo svg { flex-shrink: 0; }

  .cards {
    flex-shrink: 0;
    display: flex;
    gap: 12px;
    height: 232px;
    margin-top: 16px;
  }

  .glass {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 15px 16px 10px;
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .glass-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 17px;
    font-weight: 800;
    color: {{COR_ACENTO}};
    margin-bottom: 10px;
  }

  .glass-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, color-mix(in srgb, {{COR_ACENTO}} 50%, transparent), transparent);
  }

  .col-item {
    display: list-item;
    list-style: disc outside;
    margin-left: 14px;
    font-size: 14.5px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.92);
    line-height: 1.25;
    margin-bottom: 8px;
  }

  .col-item::marker { color: {{COR_ACENTO}}; }

  .col-item:last-child { margin-bottom: 0; }

  .cta {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 46px;
    border-radius: 999px;
    background: linear-gradient(93deg, {{COR_ACENTO}} 0%, {{COR_SECUNDARIA}} 100%);
    box-shadow: 0 6px 22px color-mix(in srgb, {{COR_ACENTO}} 35%, transparent);
    margin-top: 16px;
  }

  .cta span {
    font-size: 19px;
    font-weight: 800;
    color: #fff;
  }
</style>
</head>
<body>
<div class="card">

  <img class="foto-bg" src="{{FOTO_URL}}" alt="Profissional">
  <div class="overlay"></div>

  <div class="content">
    <div class="chip">
      <div class="chip-dot"></div>
      <span>{{UNIDADE}} &middot; Estamos contratando</span>
    </div>

    <div class="spacer"></div>

    <p class="eyebrow">Vaga na {{EMPRESA}}</p>
    <h1 class="cargo">{{CARGO}}</h1>
    <p class="subtitulo">
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 0C3.36 0 0 3.28 0 7.33 0 12.83 7.5 18 7.5 18S15 12.83 15 7.33C15 3.28 11.64 0 7.5 0Zm0 9.95a2.68 2.68 0 1 1 0-5.36 2.68 2.68 0 0 1 0 5.36Z" fill="{{COR_ACENTO}}"/>
      </svg>
      {{SUBTITULO}}
    </p>

    <div class="cards">
      <div class="glass" id="col-req">
        <span class="glass-title">Requisitos</span>
        {{REQUISITOS_HTML}}
      </div>
      <div class="glass" id="col-ben">
        <span class="glass-title">Benef&iacute;cios</span>
        {{BENEFICIOS_HTML}}
      </div>
    </div>

    <div class="cta"><span>Clique e inscreva-se!</span></div>
  </div>

</div>
<script>
  (function () {
    var scale = 1;
    var minScale = 0.55;
    var step = 0.02;
    var baseItemSize = 14.5, baseItemMargin = 8;
    var items = document.querySelectorAll('.col-item');
    var reqCol = document.getElementById('col-req');
    var benCol = document.getElementById('col-ben');

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
      var base = 42;
      var s = 1;
      el.style.whiteSpace = 'nowrap';
      while (s > 0.62 && el.scrollWidth > el.clientWidth) {
        s -= 0.02;
        el.style.fontSize = (base * s) + 'px';
      }
      // ainda não coube em 1 linha → deixa quebrar em 2
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
      fitCargo();
      fitNowrap(document.querySelector('.subtitulo'), 19);
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
