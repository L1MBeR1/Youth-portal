<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Database\Eloquent\Factories\Factory;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Log;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory <\App\Models\Model>
 */
class UserMetadataFactory extends Factory
{
    private function generateImageURL(int $width = 320, int $height = 240): string
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird', 'meme']);
        // return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }

    private function generateImageURL2(): string
    {
        // Получаем список файлов в директории storage/sample_images
        $files = Storage::disk('local')->files('sample_images/profile');

        // Если файлов нет, возвращаем пустую строку или логируем
        if (empty($files)) {
            Log::info('empty folder');
            return '';
        }

        // Выбираем случайный файл
        $randomFile = $files[array_rand($files)];

        // Получаем полный путь к файлу
        $filePath = Storage::disk('local')->path($randomFile);

        // Отправляем файл на API для загрузки
        $response = Http::attach(
            'file',
            file_get_contents($filePath),
            basename($filePath)
        )->post('http://127.0.0.1:8000/api/files/profiles/0/');

        // Log::info($response);

        // Проверяем успешность запроса и возвращаем имя файла из ответа
        if ($response->successful()) {
            $data = $response->json();
            if (!$data) {
                Log::info('error');
            }
            return env('FILES_LINK', '') . $data['filename'] ?? ''; // возвращаем только имя файла
        }

        // В случае ошибки можно бросить исключение или вернуть пустую строку
        return '';
    }


    private function getRandomNickname(): string
    {
        return $this->faker->randomElement([
            "Sweatyツ",
            "𝚁☠︎︎𝙿",
            "T̶O̶X̶I̶C̶ シ",
            "He_TTpugyMaJl_Huk",
            "K1LL3R",
            "D3ATH_ANG3L",
            "ShadowHunter",
            "N1ghtSt4lker",
            "Bl4ck_Widow",
            "Silent_Slayer",
            "N1nja_Master",
            "Ghost_W4rrior",
            "D4rk_S0ul",
            "Deadly_Viper",
            "SkullCrush3r",
            "Bl00dHound",
            "S1lent_Knight",
            "ShadowAssassin",
            "Venomous_Viper",
            "M0rtal_Fury",
            "Crimson_Reaper",
            "Ph4ntom_Lord",
            "Frost_Bite",
            "неПАДШИЙ_АНГЕЛ",
            "R4zorEdge",
            "IronFist",
            "Cyb3r_W4rrior",
            "F34R",
            "°𝓟𝓪𝚗đøʀᴀ°",
            "Xx_D3m0n_xX",
            "S1l3ncer",
            "Nightm4re",
            "ㅍ ЧㅅЙㅇК ㅍ",
            "DeadSh0t",
            "𝖅𝕭𝕰𝕽𝖇シ︎",
            "He_CMoTPU_cTaTy_",
            "Bl00dy_M4ry",
            "D4rkn3ss",
            "VengefulSpirit",
            "H3ll_Hound",
            "R3d_Dragon",
            "W1ld_H4wk",
            "Z3r0",
            "T1tan",
            "P4ndem0nium",
            "Gladiat0r",
            "N3m3sis",
            "Bl4ck_P4nther",
            "S3r4phim",
            "R4ven",
            "H3rm3s",
            "H4des",
            "D3cay",
            "Fr0stb1te",
            "Temp3st",
            "Thund3r",
            "V3ng3ance",
            "NightF4ll",
            "Gr1m_R34per",
            "P0ison",
            "Psycho_K1ller",
            "Bl1tz",
            "N1ghtSh4de",
            "H3llstorm",
            "Sp3ctral",
            "Z0mb13",
            "Rebel_S0ul",
            "Chaos_Lord",
            "Brutal_Fury",
            "G0dF4ther",
            "An0nymous",
            "F4ntom",
            "J0ker",
            "M4gnum",
            "D3adly_4ngel",
            "B4ne",
            "Dr4gon_Slayer",
            "F34rless",
            "L3gend",
            "W4rrior",
            "R4zor",
            "Gr1m",
            "D4rkd3ath",
            "S1lentK1ll",
            "N1ghtm4re",
            "B4ttl3field",
            "R3dV3nom",
            "M0rph",
            "Bl00d_Lust",
            "G0th1c",
            "Eclip5e",
            "L3thal",
            "SkullCrusher",
            "Ch4os",
            "Cr1mson",
            "R3ckless",
            "W1ndWalker",
            "S3ntinel",
            "Spectr3",
            "M4squerade",
            "H4zard",
            "J4de",
            "N3ptune",
            "S1ege",
            "W4rpath",
            "S4vage",
            "D3stiny",
            "V1per",
            "P4nther",
            "D4rth",
            "X3r0",
            "Dr34d",
            "H4voc",
            "R4mpage",
            "B3ast",
            "Obl1vion",
            "B4ttle_Axe",
            "D4rk_L3gend",
            "G3neral",
            "V4nguard",
            "R3dSkull",
            "T1tanium",
            "H3r0",
            "W1ngs",
            "S0ul_R34per",
            "D3mon",
            "L3viathan",
            "N3mes1s",
            "W0lf",
            "N1ghtShade",
            "Ph4nt0m",
            "R1ptid3",
            "G0ld3n_Eagle",
            "Cyb3rPunk",
            "NightHawk",
            "F1reb0rn",
            "R3b3l",
            "V1rus",
            "M3rcury",
            "Abyss",
            "V4mpire",
            "C0sm0s",
            "R4gnarok",
            "L1ghtning",
            "B4ttle_Royale",
            "H4des",
            "D4rkrider",
            "W1ld_Fir3",
            "E4rth_Sh4ker",
            "W1ck3d",
            "C4ptain",
            "S1l3nt",
            "D34dshot",
            "Ph4ntomL0rd",
            "S1ngul4rity",
            "P0lar1s",
            "B0mb4rd",
            "Fr0st_M0urn",
            "L0cust",
            "R0gue",
            "N1ghtrider",
            "Dr4g0nfire",
            "V3rs3",
            "G0th1c_Pr1nc3ss",
            "M0rt4l_C0il",
            "S4v4geK1ng",
            "T1m3_B0mb",
            "M1nd_Bl0w",
            "B4tman",
            "Z0mb13_K1ll3r",
            "P1erc3r",
            "M4ch1n3",
            "N3bula",
            "Th3_T3rm1n4t0r",
            "V4p0rtr41l",
            "J0k3r",
            "B4ne_0f_W0rlds",
            "N1ght_Crus4der",
            "H4rdc0re",
            "T3rr0r1st",
            "R4id3r",
            "Bl4z3r",
            "C0bra",
            "R1pp3r",
            "C4nnon",
            "H4wk",
            "R3d",
            "S1d3w1nd3r",
            "V4ngard",
            "S0v3r3ign",
            "W1zard",
            "H3x",
            "L0k1",
            "D34th_0ps",
            "Sh4d0w",
            "Gr4ve",
            "M4rch4nt",
            "F1r3F1st",
            "G0dz1ll4",
            "P3stm4st3r",
            "P1r4te",
            "R3d_L1ghtn1ng",
            "D4rkst4r",
            "N1ghtfall",
            "P4yback",
            "R0ckst4r",
            "G0th1c_L0rd",
            "M3rch4nt_0f_D34th",
            "P4lm",
            "Thund3rstr1k3",
            "F1r3bl4st",
            "N3xtG3n",
            "H1ghT1m3s",
            "R0gue_St4r",
            "T3rm1n4t0r",
            "V4nguard",
            "G0d_0f_W4r",
            "Ph4ntom_W4lk3r",
            "S1lkSh4d0w",
            "D4rth_V4d3r",
            "N1ghtW1ng",
            "R1s3_0f_Sh4d0ws",
            "D4rk_H0rse",
            "V3n0m0us",
            "M4ster_0f_D3ath",
            "G1ant",
            "B3astM0de",
            "F1n4l_D3st1n4t10n",
            "W4rM4ch1n3",
            "T3rr1f1c",
            "S3pulchr3",
            "D3vil's_R4ge",
            "N1ght_Fury",
            "F1n4l_Judg3m3nt",
            "Bl4ck_0ut",
            "S1lent_W4r",
            "H3llr1s3r",
            "M4l3v0l3nt",
            "P0w3r_H0us3",
            "S1gn4l",
            "R3tr1but10n",
            "G0d_0f_Thund3r",
            "V3rs4t1l3",
            "V3rt1g0",
            "Bl4ckH4wk",
        ]);
    }


    private function getRandomNickname2(): string
    {
        // Список  прилагательных
        $adjectives1 = [
            'счастливый',
            'быстрый',
            'яркий',
            'крутой',
            'тихий',
            'сладкий',
            'злой',
            'элегантный',
            'удачливый',
            'сказочный',
            'умный',
            'смелый',
            'доброжелательный',
            'сильный',
            'веселый',
            'любопытный',
            'острый',
            'спокойный',
            'дружелюбный',
            'мудрый'
        ];
        $adjectives2 = [
            'happy',
            'fast',
            'bright',
            'cool',
            'silent',
            'sweet',
            'angry',
            'fancy',
            'lucky',
            'candy',
            'clever',
            'brave',
            'kind',
            'strong',
            'funny',
            'curious',
            'sharp',
            'calm',
            'friendly',
            'wise',
        ];

        // Список  существительных
        $nouns1 = [
            'кот',
            'собака',
            'птица',
            'медведь',
            'рыба',
            'волк',
            'лиса',
            'тигр',
            'лев',
            'кролик',
            'мышь',
            'слон',
            'жираф',
            'обезьяна',
            'пингвин',
            'олень',
            'лошадь',
            'корова',
            'сова',
            'акула'
        ];
        $nouns2 = [
            'cat',
            'dog',
            'bird',
            'bear',
            'fish',
            'wolf',
            'fox',
            'tiger',
            'lion',
            'rabbit',
            'mouse',
            'elephant',
            'giraffe',
            'monkey',
            'penguin',
            'deer',
            'horse',
            'cow',
            'owl',
            'shark',
        ];


        do {
            // Генерируем случайное число
            $number = random_int(1000, 9999);

            // Определяем, какой язык использовать (1 или 2)
            $locale = random_int(1, 2);

            // Выбираем случайные прилагательные и существительные в зависимости от языка
            $adjectiveList = ${"adjectives{$locale}"};
            $nounList = ${"nouns{$locale}"};

            $adjective = $this->faker->randomElement($adjectiveList);
            $noun = $this->faker->randomElement($nounList);

            // Собираем никнейм
            $nickname = "{$adjective}_{$noun}_{$number}";

            // Проверяем, существует ли уже такой никнейм
            $nicknameExists = UserMetadata::where('nickname', $nickname)->exists();

        } while ($nicknameExists); // Генерируем новый никнейм, если текущий занят

        return $nickname;
    }



    protected $model = UserMetadata::class;

    public function definition()
    {
        $image = $this->generateImageURL2();
        // $image = 'a';
        // Log::info($image);


        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'patronymic' => $this->faker->middleName,
            'nickname' => $this->getRandomNickname2(),
            'profile_image_uri' => $image,
            'gender' => $this->faker->randomElement(['m', 'f']),
            'city' => $this->faker->city,
            'birthday' => $this->faker->date,
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (UserMetadata $userMetadata) {
            $userMetadata->setKeyName('user_id');
        });
    }
}
