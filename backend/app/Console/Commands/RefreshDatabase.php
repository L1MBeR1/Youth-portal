<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RefreshDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reseed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Wipe the database, run migrations and seed the database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->call('db:wipe');
        $this->call('migrate');
        $this->call('db:seed');

        $this->info('Done!'); 

        return 0;
    }
}
