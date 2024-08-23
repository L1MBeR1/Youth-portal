import chroma from 'chroma-js';
import {FastAverageColor} from 'fast-average-color';

export async function getBackgroundColor(imageSrc,) {
  console.log(imageSrc)
  const fac = new FastAverageColor();

  try {
    const color = await fac.getColorAsync(imageSrc, { algorithm:'simple',mode:'speed' });
		console.log(color)
    const dominantColor = chroma(color.hex);
console.log(dominantColor)
    const pastelColor = dominantColor
      // .mix(chroma('#ffffff'), 0.5) 
      // .brighten(1) 
      // .saturate(0.5)
      .hex();
				console.log(pastelColor)
    return pastelColor;
  } catch (error) {
    console.error('Ошибка получения доминирующего цвета:', error);
    return '#ffffff';
  }
}