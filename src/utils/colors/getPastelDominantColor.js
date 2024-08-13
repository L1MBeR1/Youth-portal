import chroma from 'chroma-js';
import {FastAverageColor} from 'fast-average-color';

export async function getPastelDominantColor(imageSrc,) {
  console.log(imageSrc)
  const fac = new FastAverageColor();

  try {
    const color = await fac.getColorAsync(imageSrc, { algorithm:'simple',mode:'speed' });
    const dominantColor = chroma(color.hex);

    const pastelColor = dominantColor
      // .mix(chroma('#ffffff'), 0.5) 
      // .brighten(1) 
      // .saturate(0.5)
      .hex();

    return pastelColor;
  } catch (error) {
    console.error('Ошибка получения доминирующего цвета:', error);
    return '#ffffff';
  }
}