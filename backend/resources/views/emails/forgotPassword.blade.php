<!DOCTYPE html>
<html>
<head>
    <title>Password Recovery</title>
</head>
<body>
    <h1>Hello, {{ $user->name }}!</h1>
    <p>You have requested to reset your password. Click the link below to reset your password:</p>
    <p>
        <a href="{{ $resetUrl }}">Reset Password</a>
    </p>
    <p>This link will expire in 15 minutes.</p>
</body>
</html>
