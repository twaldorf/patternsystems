const header = `
    <header>
        <a href="/">
            <h1>Design pattern systems</h1>
        </a>
    </header>
`

const btnLogin = `
    <a class="button" id="btnLogin" href="/login">Log in</a>
`

const editorBanner = `
    <section>
    <div id="banner">
        <h4>System designer</h4>
        {btnLogin}
    </div>
    </section>
`

const savesBanner = `
<section>
<div id="banner">
    <h4>Saved patterns</h4>
    {btnLogin}
</div>
</section>
`

module.exports = {
  header, btnLogin, editorBanner, savesBanner,
}
