function LangComponent({ lang }) {
  return <div class="langs" hx-boost="true">
    <a
      id="langs--link_ru"
      class={`langs--link ${lang == "ru" ? "langs--link_active" : ""}`}
      href="/"
    >
      ru
    </a>
    <a
      id="langs--link_en"
      class={`langs--link ${lang == "en" ? "langs--link_active" : ""}`}
      href="/en"
    >
      en
    </a>
  </div>;
}

exports.LangComponent = LangComponent;
