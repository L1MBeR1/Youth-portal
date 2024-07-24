<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
        }
        h1 {
            color: #3490dc;
            margin-bottom: 20px;
        }
        p {
            margin: 0 0 10px;
            color: #333;
        }
        .button {
            display: inline-block;
            background: #3490dc;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .button:hover {
            background: #2176bd;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Подтверждение Email</h1>
        <p>Пожалуйста, подтвердите свою электронную почту, перейдя по следующей ссылке:</p>
        <p><a href="{{ $verificationUrl }}" class="button">Подтвердить email</a></p>
        <p>Спасибо за регистрацию!</p>
    </div>
</body>
</html>
