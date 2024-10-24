<?php

namespace Database\Factories;

use Carbon\Carbon;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Services\ImageSeeder;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    protected $model = Blog::class;

    private $images = [];
    private $imageCount;


    private function generateImageUrls(int $blogId): array
    {
        $imageSeeder = new ImageSeeder();
        return $imageSeeder->generateImageURL(
            $blogId,
            [
                'sample_images/blog_content' => $this->imageCount,
                'sample_images/blog_cover' => 1,
            ],
            'blogs'
        );
    }


    private function generateContent(int $blogId): string
    {
        $basePlainText = $this->faker->realText(15000);
        $sentences = preg_split('/(?<=[.!?])\s+/', $basePlainText);
        $paragraphs = $this->createParagraphs($sentences);

        $this->imageCount = random_int(1, 3);
        $this->images = $this->generateImageUrls($blogId);

        return $this->buildContentWithImages($paragraphs);
    }


    private function createParagraphs(array $sentences): array
    {
        $paragraphs = [];
        $paragraph = '';

        foreach ($sentences as $sentence) {
            $paragraph .= $sentence . ' ';
            if (random_int(0, 10) > 7) {
                $paragraphs[] = trim($paragraph);
                $paragraph = '';
            }
        }

        if (!empty($paragraph)) {
            $paragraphs[] = trim($paragraph);
        }

        return $paragraphs;
    }


    private function buildContentWithImages(array $paragraphs): string
    {
        $htmlTags = ['<b>', '</b>', '<i>', '</i>', '<u>', '</u>', '<strong>', '</strong>', '<em>', '</em>'];
        $finalText = '';

        foreach ($paragraphs as $paragraph) {
            $finalText .= '<p>' . $this->applyRandomHtmlTags($paragraph, $htmlTags) . '</p>';

            if (random_int(0, 10) > 7 && count($this->images) > 1) {
                $image = array_shift($this->images);
                $finalText .= $this->embedImage($image);
            }
        }

        return $finalText;
    }


    private function applyRandomHtmlTags(string $paragraph, array $htmlTags): string
    {
        $words = explode(' ', $paragraph);
        foreach ($words as &$word) {
            if (random_int(0, 10) > 7) {
                $tag = $htmlTags[array_rand($htmlTags)];
                $word = $tag . $word . str_replace('<', '</', $tag);
            }
        }
        return implode(' ', $words);
    }


    private function embedImage(string $imageUrl): string
    {
        return '<div style="text-align:center;"><img src="' . $imageUrl . '" alt="Blog Image" style="max-width:100%;height:auto;"></div>';
    }


    private function generateBlogTitle(): string
    {
        $adjectives = [
            'мужской род' => ['Вдохновляющий', 'Познавательный', 'Захватывающий'],
            'женский род' => ['Вдохновляющая', 'Познавательная', 'Захватывающая'],
            'средний род' => ['Вдохновляющее', 'Познавательное', 'Захватывающее'],
        ];
        $nouns = [
            'мужской род' => ['опыт', 'путь', 'стиль'],
            'женский род' => ['жизнь', 'мечта', 'страсть'],
            'средний род' => ['саморазвитие', 'здоровье', 'хобби'],
        ];
        $thirdWords = [
            'мужской род' => ['пути', 'разума', 'духа'],
            'женский род' => ['мечты', 'страсти', 'идеи'],
            'средний род' => ['человека', 'мудрости', 'озарения'],
        ];

        $gender = array_rand($adjectives);
        $adjective = $this->faker->randomElement($adjectives[$gender]);
        $noun = $this->faker->randomElement($nouns[$gender]);
        $thirdWord = $this->faker->randomElement($thirdWords[$gender]);

        return "$adjective $noun $thirdWord";
    }


    public function definition(): array
    {
        $dateTime = Carbon::create(random_int(2019, 2022), random_int(1, 12), random_int(1, 28), 10)->setTimezone('UTC');
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->generateBlogTitle(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => ['tags' => [$this->faker->randomElement(['наука', 'культура', 'путешествия'])]]
            ],
            'content' => '',
            'cover_uri' => '',
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'created_at' => $dateTime->format('Y-m-d H:i:s'),
            'updated_at' => $dateTime->format('Y-m-d H:i:s'),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }


    // public function configure(): self
    // {
    //     return $this->afterCreating(function (Blog $blog) {
    //         $content = $this->generateContent($blog->id);
    //         $coverUri = $this->images[0] ?? '';

    //         $blog->update(['cover_uri' => $coverUri, 'content' => $content]);
    //     });
    // }
    public function configure(): self
    {
        return $this->afterCreating(function (Blog $blog) {
            try {
                $content = $this->generateContent($blog->id);
                $coverUri = $this->images[0] ?? '';

                $blog->update(['cover_uri' => $coverUri, 'content' => $content]);
            } catch (\RuntimeException $e) {
                Log::error('Error during blog creation: ' . $e->getMessage());
                
                echo 'Error during blog creation: ' . $e->getMessage() . PHP_EOL;
            }
        });
    }

}
