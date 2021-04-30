const header = `
    <header>
        <a href="/">
            <h1>Design pattern systems</h1>
        </a>
    </header>
`

const btnLogin = `
    <a class="button" href="/login">Log in</a>
`

const banner = `
    <section>
    <div id="banner">
        <h4>System designer</h4>
        {btnLogin}
    </div>
    </section>
`

module.exports = { header, btnLogin, banner }