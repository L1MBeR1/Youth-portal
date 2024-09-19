<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Восстановление пароля</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        .error {
            color: red;
            font-size: 14px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Восстановление пароля</h1>
        <form id="reset-form">
            <input type="hidden" id="token" value="{{ token }}">
            <input type="hidden" id="email" value="{{ email }}">

            <div>
                <label for="password">Новый пароль:</label>
                <input type="password" id="password" required>
            </div>

            <div>
                <label for="password_confirmation">Подтвердите новый пароль:</label>
                <input type="password" id="password_confirmation" required>
            </div>

            <div class="error" id="error-message"></div>

            <button type="submit">Обновить пароль</button>
        </form>
    </div>

    <script>
        document.getElementById('reset-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const token = document.getElementById('token').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirmation = document.getElementById('password_confirmation').value;
            const errorMessage = document.getElementById('error-message');

            if (password !== passwordConfirmation) {
                errorMessage.textContent = 'Пароли не совпадают.';
                return;
            }

            fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    token: token,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirmation
                })
            })
            .then(response => response.json())
            .then(data => {
                if (response.ok) {
                    alert('Пароль успешно обновлен.');
                    window.location.href = '/login'; // Перенаправление на страницу входа
                } else {
                    errorMessage.textContent = data.error || 'Произошла ошибка при обновлении пароля.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Произошла ошибка при обновлении пароля.';
            });
        });
    </script>
</body>
</html>
