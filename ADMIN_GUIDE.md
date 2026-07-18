# Novaclean owner dashboard

URL: `/admin`

## Что можно менять без кода

- просматривать новые photo quotes, care requests, commercial leads и сообщения;
- менять статус заявки, legal hold и удалять записи;
- добавлять публичный телефон, email и часы;
- менять английский и испанский первый экран главной;
- временно приостанавливать онлайн-заявки;
- включать короткое сервисное объявление;
- менять extended-zone minimum;
- менять все 22 цены и EN/ES scope;
- редактировать SEO title/description главной;
- добавлять Google Search Console verification token;
- запускать retention cleanup и проверять системные controls.

## Безопасность

Логин и пароль проверяются только на Cloudflare Worker. Пароль не записан в Git, HTML или клиентский JavaScript. После входа сервер выдаёт закрытую `HttpOnly`, `SameSite=Strict` сессию на 12 часов. Вход защищён rate limit.

После изменения настроек нажмите **Save changes**. Новые загрузки страниц сразу используют сохранённую конфигурацию.

