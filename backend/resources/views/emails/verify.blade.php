
@component('mail::message')

Пожалуйста, подтвердите свою электронную почту, перейдя по следующей ссылке:

@component('mail::button', ['url' => $verificationUrl])
Подтвердить email
@endcomponent

Спасибо за регистрацию!

@endcomponent
