export const TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 540px;
    height: 675px;
    overflow: hidden;
    background: #fff;
    font-family: 'Nunito', sans-serif;
  }

  .card {
    width: 540px;
    height: 675px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    background: #1c8fa3;
    padding: 13px 24px 11px;
    text-align: center;
    flex-shrink: 0;
  }

  .header-line1 {
    font-size: 13.5px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 7px;
    letter-spacing: 0.1px;
  }

  .header-line1 strong {
    font-weight: 900;
  }

  .cargo-badge {
    background: #52c46a;
    border-radius: 8px;
    padding: 6px 18px;
    margin-bottom: 0px;
    display: block;
  }

  .cargo-badge span {
    font-size: 20px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.3px;
    display: block;
    line-height: 1.2;
  }

  .header-divider {
    height: 2.5px;
    background: #145f70;
    margin: 8px 0 7px;
    border-radius: 2px;
  }

  .localidade-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .pin-icon {
    width: 11px;
    height: 14px;
    flex-shrink: 0;
  }

  .localidade-text {
    font-size: 13.5px;
    font-weight: 800;
    color: #fff;
  }

  .foto-area {
    flex: 1;
    background: #d6eef2;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  .foto-img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  .logo-pill {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background: #fff;
    border-radius: 40px 40px 0 0;
    padding: 9px 32px 0;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.12);
  }

  .logo-text {
    font-size: 23px;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .logo-sales { color: #1a2e5a; }
  .logo-jobs  { color: #1c8fa3; }

  .footer {
    background: #1c8fa3;
    display: flex;
    flex-shrink: 0;
    min-height: 195px;
  }

  .col {
    flex: 1;
    padding: 11px 14px 13px;
  }

  .col-left {
    border-right: 1.5px solid rgba(255,255,255,0.3);
  }

  .col-title {
    font-size: 15px;
    font-weight: 900;
    color: #f5a623;
    margin-bottom: 7px;
    display: block;
  }

  .col-right .col-title {
    text-align: center;
  }

  .col-item {
    font-size: 11.5px;
    font-weight: 700;
    color: #fff;
    line-height: 1.35;
    margin-bottom: 5px;
    display: block;
  }

  .col-right .col-item {
    text-align: center;
  }
</style>
</head>
<body>
<div class="card">

  <div class="header">
    <p class="header-line1">Trabalhe na <strong>{{EMPRESA}}</strong> com o <strong>Salesjobs</strong></p>
    <div class="cargo-badge">
      <span>{{CARGO}}</span>
    </div>
    <div class="header-divider"></div>
    <div class="localidade-row">
      <svg class="pin-icon" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 0C2.462 0 0 2.462 0 5.5 0 9.625 5.5 14 5.5 14S11 9.625 11 5.5C11 2.462 8.538 0 5.5 0zm0 7.7A2.2 2.2 0 1 1 5.5 3.3a2.2 2.2 0 0 1 0 4.4z" fill="white"/>
      </svg>
      <span class="localidade-text">{{LOCALIDADE}}</span>
    </div>
  </div>

  <div class="foto-area">
    <img class="foto-img" src="{{FOTO_URL}}" alt="Profissional">
    <div class="logo-pill">
      <span class="logo-text">
        <span class="logo-sales">sales</span><span class="logo-jobs">jobs</span>
      </span>
    </div>
  </div>

  <div class="footer">
    <div class="col col-left">
      <span class="col-title">Requisitos</span>
      {{REQUISITOS_HTML}}
    </div>
    <div class="col col-right">
      <span class="col-title">Benefícios</span>
      {{BENEFICIOS_HTML}}
    </div>
  </div>

</div>
</body>
</html>`
