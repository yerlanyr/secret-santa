const { Router } = require("express");
const { LangComponent } = require("../components/LangComponent");
const Layout = require("../components/Layout");
const { MainPageButtons } = require("../components/MainPageButtons");
const { i18n, SECRET_SANTA } = require("../i18n");

const homePageRouter = new Router()
homePageRouter.get('/', (req, res) => {
  const lang = req.lang;
  const isLoggedIn = req.session.roomName !== undefined;

  res.send(
    <Layout>
      <LangComponent lang={lang} />
      <h1 class="heading">{i18n(lang, SECRET_SANTA)}</h1>
      <MainPageButtons isLoggedIn={isLoggedIn} lang={lang} />
    </Layout>
  );
});

homePageRouter.get("/exit-room", (req, res) => {
  const lang = req.lang;
  req.session.userName = undefined;
  req.session.roomName = undefined;
  res.redirect("/" + lang);
});

module.exports = homePageRouter