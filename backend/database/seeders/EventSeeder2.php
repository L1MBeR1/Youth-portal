<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Services\ImageSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder2 extends Seeder
{
    private function generateEventCover(int $eventId)
    {
        $imageSeeder = new ImageSeeder();
        $image = $imageSeeder->generateImageURL($eventId, ['sample_images/event_cover' => 1], 'events');
        return $image[0];
    }


    public function run(): void
    {
        $events = [
            [
                'name' => 'Форум инноваций',
                'description' => 'Международный форум по развитию инновационных технологий.',
                'address' => json_encode([
                    'country' => 'Россия',
                    'city' => 'Москва',
                    'street' => 'Тверская улица',
                    'house' => 'д. 1'
                ]),
                'longitude' => 37.6173,
                'latitude' => 55.7558,
                'views' => 150,
                'cover_uri' => $this->generateEventCover(1),
                'start_time' => Carbon::parse('2024-09-30 09:00:00', 'Europe/Moscow'),
                'end_time' => Carbon::parse('2024-10-01 18:00:00', 'Europe/Moscow'),
                'author_id' => 1,
                'project_id' => 1,
            ],
            [
                'name' => 'Конференция по экологии',
                'description' => 'Вопросы экологии и охраны окружающей среды.',
                'address' => json_encode([
                    'country' => 'Казахстан',
                    'city' => 'Нур-Султан',
                    'street' => 'проспект Абая',
                    'house' => 'д. 25'
                ]),
                'cover_uri' => $this->generateEventCover(2),
                'longitude' => 71.4287,
                'latitude' => 51.1694,
                'views' => 200,
                'start_time' => Carbon::parse('2024-10-05 10:00:00', 'Asia/Almaty'),
                'end_time' => Carbon::parse('2024-10-05 16:00:00', 'Asia/Almaty'),
                'author_id' => 2,
                'project_id' => 2,
            ],
            [
                'cover_uri' => $this->generateEventCover(3),
                'name' => 'Турнир по шахматам',
                'description' => 'Международный турнир по шахматам среди молодежи.',
                'address' => json_encode([
                    'country' => 'Беларусь',
                    'city' => 'Минск',
                    'street' => 'улица Ленина',
                    'house' => 'д. 10'
                ]),
                'longitude' => 27.5615,
                'latitude' => 53.9023,
                'views' => 120,
                'start_time' => Carbon::parse('2024-09-15 09:00:00', 'Europe/Minsk'),
                'end_time' => Carbon::parse('2024-10-15 17:00:00', 'Europe/Minsk'),
                'author_id' => 3,
                'project_id' => 3,
            ],
            [
                'cover_uri' => $this->generateEventCover(4),
                'name' => 'Культурный фестиваль',
                'description' => 'Фестиваль, посвященный традициям и культуре народов СНГ.',
                'address' => json_encode([
                    'country' => 'Узбекистан',
                    'city' => 'Ташкент',
                    'street' => 'проспект Независимости',
                    'house' => 'д. 100'
                ]),
                'longitude' => 69.2401,
                'latitude' => 41.2995,
                'views' => 300,
                'start_time' => Carbon::parse('2024-09-20 10:00:00', 'Asia/Tashkent'),
                'end_time' => Carbon::parse('2024-09-20 20:00:00', 'Asia/Tashkent'),
                'author_id' => 4,
                'project_id' => 4,
            ],
            [
                'cover_uri' => $this->generateEventCover(5),
                'name' => 'Форум молодых ученых',
                'description' => 'Международный форум молодых ученых по обмену опытом и знаниями.',
                'address' => json_encode([
                    'country' => 'Армения',
                    'city' => 'Ереван',
                    'street' => 'улица Маштоца',
                    'house' => 'д. 15'
                ]),
                'longitude' => 44.5090,
                'latitude' => 40.1833,
                'views' => 180,
                'start_time' => Carbon::parse('2024-10-01 09:00:00', 'Asia/Yerevan'),
                'end_time' => Carbon::parse('2024-10-11 17:00:00', 'Asia/Yerevan'),
                'author_id' => 5,
                'project_id' => 5,
            ],
            [
                'cover_uri' => $this->generateEventCover(6),
                'name' => 'Международная выставка искусства',
                'description' => 'Выставка произведений искусства художников из стран СНГ.',
                'address' => json_encode([
                    'country' => 'Азербайджан',
                    'city' => 'Баку',
                    'street' => 'улица Низами',
                    'house' => 'д. 30'
                ]),
                'longitude' => 49.8671,
                'latitude' => 40.4093,
                'views' => 220,
                'start_time' => Carbon::parse('2024-09-28 10:00:00', 'Asia/Baku'),
                'end_time' => Carbon::parse('2024-09-29 18:00:00', 'Asia/Baku'),
                'author_id' => 6,
                'project_id' => 6,
            ],
            [
                'cover_uri' => $this->generateEventCover(7),
                'name' => 'Технологический симпозиум',
                'description' => 'Обсуждение последних достижений в области технологий и IT.',
                'address' => json_encode([
                    'country' => 'Кыргызстан',
                    'city' => 'Бишкек',
                    'street' => 'проспект Манаса',
                    'house' => 'д. 5'
                ]),
                'longitude' => 74.5895,
                'latitude' => 42.8746,
                'views' => 250,
                'start_time' => Carbon::parse('2024-10-10 09:00:00', 'Asia/Bishkek'),
                'end_time' => Carbon::parse('2024-10-11 16:00:00', 'Asia/Bishkek'),
                'author_id' => 7,
                'project_id' => 7,
            ],
            [
                'cover_uri' => $this->generateEventCover(8),
                'name' => 'Спортивные игры СНГ',
                'description' => 'Международные спортивные соревнования среди молодежи.',
                'address' => json_encode([
                    'country' => 'Таджикистан',
                    'city' => 'Душанбе',
                    'street' => 'проспект Рудаки',
                    'house' => 'д. 20'
                ]),
                'longitude' => 68.7791,
                'latitude' => 38.5598,
                'views' => 350,
                'start_time' => Carbon::parse('2024-09-25 08:00:00', 'Asia/Dushanbe'),
                'end_time' => Carbon::parse('2024-09-29 20:00:00', 'Asia/Dushanbe'),
                'author_id' => 8,
                'project_id' => 8,
            ],
            [
                'cover_uri' => $this->generateEventCover(9),
                'name' => 'Выставка научных достижений',
                'description' => 'Выставка, посвященная новейшим достижениям науки и техники.',
                'address' => json_encode([
                    'country' => 'Молдова',
                    'city' => 'Кишинев',
                    'street' => 'улица Штефан чел Маре',
                    'house' => 'д. 25'
                ]),
                'longitude' => 28.8575,
                'latitude' => 47.0105,
                'views' => 230,
                'start_time' => Carbon::parse('2024-09-10 09:00:00', 'Europe/Chisinau'),
                'end_time' => Carbon::parse('2024-09-11 18:00:00', 'Europe/Chisinau'),
                'author_id' => 9,
                'project_id' => 9,
            ],
            [
                'cover_uri' => $this->generateEventCover(10),
                'name' => 'Бизнес-форум СНГ',
                'description' => 'Форум по обсуждению новых бизнес-возможностей в странах СНГ.',
                'address' => json_encode([
                    'country' => 'Туркменистан',
                    'city' => 'Ашхабад',
                    'street' => 'проспект Туркменбаши',
                    'house' => 'д. 45'
                ]),
                'longitude' => 58.3838,
                'latitude' => 37.9601,
                'views' => 400,
                'start_time' => Carbon::parse('2024-10-20 09:00:00', 'Asia/Ashgabat'),
                'end_time' => Carbon::parse('2024-10-20 17:00:00', 'Asia/Ashgabat'),
                'author_id' => 10,
                'project_id' => 10,
            ],
            [
                'cover_uri' => $this->generateEventCover(11),
                'name' => 'Концерт Виктора Цоя',
                'description' => 'Концерт в честь легендарной песни "Скоро кончится лето".',
                'address' => json_encode([
                    'country' => 'Россия',
                    'city' => 'Иркутск',
                    'street' => 'улица Ленина',
                    'house' => 'д. 50'
                ]),
                'longitude' => 104.2960,
                'latitude' => 52.2978,
                'views' => 1000,
                'start_time' => Carbon::parse('2024-09-25 19:00:00', 'Asia/Irkutsk'),
                'end_time' => Carbon::parse('2024-09-27 21:00:00', 'Asia/Irkutsk'),
                'author_id' => 11,
                'project_id' => 11,
            ],
            
        ];

        // Вставляем данные в таблицу events
        DB::table('events')->insert($events);
    }
}
