>  ![баквит](images/logo.png)
> 
>  ***Добро пожаловать в Чат Энвелла, я ваш проводник - Баквит!***

Баквит - бот-администратор, созданный специально для чата https://t.me/envell_chat.

## Что умеет?

- **Приветствует новых игроков**
    - ![скриншот приветствия](images/hello.png)
- **Умеет отвечать на команды:**
    - ![скриншот команд](images/commands.png)
- **Имеет секретные команды**
    - ![скриншот секретной команды](images/secret.png)

## Как добавить *Баквита* в чат?

1. Перейти в профиль [Баквита](https://t.me/buckwheat_envell_bot)
2. Пригласить его в свой чат
3. Дать ему права администратора
   ![Нужные права](images/rights.png)
4. ...
5. **ПРОФИТ!**

## Как захостить своего *Баквита*?

1. Установить последнюю версию *NodeJS*.
2. Установить последнюю версию *MongoDB*.
3. Скачать данный репозиторий, используя `git clone https://github.com/Rul991/buckwheat-bot` или через архив.
4. Переименовать `rename to .env` в `.env`
5. Получить токен через [@BotFather](https://t.me/BotFather)
6. Заполнить `.env`
   
    **Пример:**

    ```ini
    # полученный токен от @BotFather
    BOT_TOKEN = 1234567890:ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjk
    # название базы данных(можно ввести любое)
    DB_NAME = database 
    # можно оставить как тут, если mongodb установлен на тот же компьютер
    DB_URL = mongodb://localhost:27017
    # id чата
    CHAT_ID = -100000000000
    # твой id(не username) в тг
    DEV_ID = 1234567890 
    # оставить как тут
    MODE = prod

    # Если вы не используете webhook, то следующие поля можно не заполнять

    DOMAIN = # Домен
    HOOK_PORT = 3000 # Порт
    SECRET_TOKEN = # Секретный токен для предотвращения случайных попаданий на ваш сайт
    SECRET_PATH = / # Путь на сайте до вашего хука
    ```

7. Ввести в консоль `npm run dev` или `npm start`
8. ...
9. **ПРОФИТ!**

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)