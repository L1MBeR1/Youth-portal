<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Contracts\Factory as SocialiteFactory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(SocialiteFactory $socialite)
    {
        $socialite->extend('vkontakte', function ($app) use ($socialite) {
            $config = $app['config']['services.vkontakte'];
            return $socialite->buildProvider(\SocialiteProviders\VKontakte\Provider::class, $config);
        });
    }
}

