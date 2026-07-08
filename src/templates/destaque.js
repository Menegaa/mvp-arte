// Template Destaque — inspirado na referência de arte com pessoa à direita:
// cargo gigante à esquerda, seções PERFIL (requisitos) e PACOTE (benefícios)
// com ícones, CTA com brilho. Tematizado pela paleta da unidade
// ({{COR_ACENTO}}/{{COR_SECUNDARIA}}/{{COR_FUNDO}} — docs/design-system.md).
export const TEMPLATE_DESTAQUE = `<!DOCTYPE html>
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

  /* pessoa entra pela direita; degradês fundem a foto com o fundo à esquerda/embaixo */
  .foto-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 36% 18%;
  }

  .foto-fade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg,
        color-mix(in srgb, {{COR_FUNDO}} 80%, transparent) 0%,
        color-mix(in srgb, {{COR_FUNDO}} 40%, transparent) 8%,
        transparent 18%),
      linear-gradient(90deg,
        {{COR_FUNDO}} 18%,
        color-mix(in srgb, {{COR_FUNDO}} 82%, transparent) 34%,
        color-mix(in srgb, {{COR_FUNDO}} 30%, transparent) 58%,
        transparent 78%),
      linear-gradient(0deg,
        {{COR_FUNDO}} 7%,
        color-mix(in srgb, {{COR_FUNDO}} 55%, transparent) 20%,
        transparent 42%);
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px 26px 22px;
  }

  .topbar {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topbar svg { flex-shrink: 0; }

  .slogan {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #fff;
    white-space: nowrap;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
  }

  .slogan em {
    font-style: normal;
    color: {{COR_ACENTO}};
  }

  .cargo {
    margin-top: 16px;
    max-width: 96%;
    font-size: 52px;
    font-weight: 800;
    color: #fff;
    line-height: 1.04;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
  }

  .loc {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 12px;
  }

  .loc svg { flex-shrink: 0; margin-top: 3px; }

  .loc-l1 {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    white-space: nowrap;
  }

  .loc-l2 {
    font-size: 16px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
  }

  .secoes {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin-top: 14px;
    width: 64%;
    min-width: 0;
    overflow: hidden;
  }

  .secao { margin-bottom: 10px; }

  .secao-head {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 7px;
  }

  .secao-head svg { flex-shrink: 0; }

  .secao-title {
    font-size: 21px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: {{COR_ACENTO}};
  }

  .col-item {
    display: list-item;
    list-style: disc outside;
    margin-left: 17px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 7px;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  }

  .col-item::marker { color: {{COR_ACENTO}}; }

  .cta {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 54px;
    border-radius: 14px;
    background: linear-gradient(180deg, {{COR_ACENTO}} 0%, color-mix(in srgb, {{COR_ACENTO}} 55%, {{COR_FUNDO}}) 100%);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 22px color-mix(in srgb, {{COR_ACENTO}} 55%, transparent);
    margin-top: 12px;
  }

  .cta span {
    font-size: 23px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #fff;
  }
</style>
</head>
<body>
<div class="card">

  <img class="foto-bg" src="{{FOTO_URL}}" alt="Profissional">
  <div class="foto-fade"></div>

  <div class="content">
    <div class="topbar">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="24" height="24" rx="7" stroke="{{COR_ACENTO}}" stroke-width="2"/>
        <path d="M13 6.5 20 15h-4.2v4.5h-5.6V15H6L13 6.5Z" fill="#fff"/>
      </svg>
      <p class="slogan">{{UNIDADE}} <em>&middot; Estamos contratando</em></p>
    </div>

    <h1 class="cargo">{{CARGO}}</h1>

    <div class="loc">
      <svg width="20" height="24" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 0C3.36 0 0 3.28 0 7.33 0 12.83 7.5 18 7.5 18S15 12.83 15 7.33C15 3.28 11.64 0 7.5 0Zm0 9.95a2.68 2.68 0 1 1 0-5.36 2.68 2.68 0 0 1 0 5.36Z" fill="{{COR_ACENTO}}"/>
      </svg>
      <div>
        <p class="loc-l1">{{LOCALIDADE}}</p>
        <p class="loc-l2">{{SEGMENTO}}</p>
      </div>
    </div>

    <div class="secoes" id="secoes">
      <div class="secao">
        <div class="secao-head">
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.5" cy="11.5" r="10.5" stroke="{{COR_ACENTO}}" stroke-width="1.8"/>
            <circle cx="11.5" cy="9" r="3.2" stroke="{{COR_ACENTO}}" stroke-width="1.8"/>
            <path d="M5.5 18.2c1-2.9 3.3-4.4 6-4.4s5 1.5 6 4.4" stroke="{{COR_ACENTO}}" stroke-width="1.8"/>
          </svg>
          <span class="secao-title">Perfil</span>
        </div>
        {{REQUISITOS_HTML}}
      </div>
      <div class="secao">
        <div class="secao-head">
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="8" width="18" height="12.5" rx="2" stroke="{{COR_ACENTO}}" stroke-width="1.8"/>
            <path d="M2.5 12.5h18M11.5 8v12.5M11.5 8S8 7.8 6.8 5.9c-.9-1.4.2-3.2 1.9-2.9 2.1.3 2.8 5 2.8 5Zm0 0s3.5-.2 4.7-2.1c.9-1.4-.2-3.2-1.9-2.9-2.1.3-2.8 5-2.8 5Z" stroke="{{COR_ACENTO}}" stroke-width="1.8"/>
          </svg>
          <span class="secao-title">Pacote</span>
        </div>
        {{BENEFICIOS_HTML}}
      </div>
    </div>

    <div class="cta">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12V5.6a1.8 1.8 0 0 1 3.6 0V11l4.9 1.2c1.1.3 1.9 1.3 1.8 2.5l-.4 4.2a2.6 2.6 0 0 1-2.6 2.4h-5.4c-.8 0-1.6-.4-2.1-1L6 16.4a1.7 1.7 0 0 1 2.5-2.3l1.5 1.4" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.2 4.2A4.6 4.6 0 0 1 12 2.2c1.5 0 2.9.8 3.7 2" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
      <span>Clique e inscreva-se!</span>
    </div>
  </div>

</div>
<script>
  (function () {
    var scale = 1;
    var minScale = 0.55;
    var step = 0.02;
    var baseItemSize = 15, baseItemMargin = 7;
    var items = document.querySelectorAll('.col-item');
    var secoes = document.getElementById('secoes');

    function apply(s) {
      for (var j = 0; j < items.length; j++) {
        items[j].style.fontSize = (baseItemSize * s) + 'px';
        items[j].style.marginBottom = (baseItemMargin * s) + 'px';
      }
    }

    function overflows() {
      return secoes.scrollHeight > secoes.clientHeight;
    }

    function fitNowrap(el, baseSize) {
      if (!el) return;
      var s = 1;
      while (s > 0.5 && el.scrollWidth > el.clientWidth) {
        s -= 0.02;
        el.style.fontSize = (baseSize * s) + 'px';
      }
    }

    // cargo quebra em linhas naturalmente; encolhe até caber em 2 linhas
    function fitCargo() {
      var el = document.querySelector('.cargo');
      if (!el) return;
      var base = 52;
      var s = 1;
      while (s > 0.5 && el.scrollHeight > base * s * 1.04 * 2 + 6) {
        s -= 0.02;
        el.style.fontSize = (base * s) + 'px';
      }
    }

    function trimOverflow() {
      var i = items.length - 1;
      while (i >= 0 && overflows()) {
        items[i].style.display = 'none';
        i--;
      }
    }

    function shrink() {
      fitCargo();
      fitNowrap(document.querySelector('.slogan'), 15);
      fitNowrap(document.querySelector('.loc-l1'), 22);
      fitNowrap(document.querySelector('.loc-l2'), 16);
      // sem localidade/segmento → esconde a linha (evita pin ao lado de texto vazio)
      var l1 = document.querySelector('.loc-l1');
      var l2 = document.querySelector('.loc-l2');
      if (l1 && !l1.textContent.trim()) l1.style.display = 'none';
      if (l2 && !l2.textContent.trim()) l2.style.display = 'none';
      if (l1 && l2 && l1.style.display === 'none' && l2.style.display === 'none') {
        document.querySelector('.loc').style.display = 'none';
      }
      apply(scale);
      // sobrou espaço → cresce a fonte até 1.3x
      while (scale < 1.3 && !overflows()) {
        scale += step;
        apply(scale);
      }
      while (scale > minScale && overflows()) {
        scale -= step;
        apply(scale);
      }
      if (overflows()) trimOverflow();
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
