export interface Point {
  x: number;
  y: number;
}

export function generateTextShape(text: string, centerX: number, centerY: number, width: number, height: number): Point[] {
  const points: Point[] = [];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  const fontSize = Math.min(width / 5.2, 88) * 0.9;
  ctx.fillStyle = '#fff';
  ctx.font = `500 ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, height / 2 + (i - lines.length / 2 + 0.5) * fontSize * 1.24);
  });
  
  const data = ctx.getImageData(0, 0, width, height).data;
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 120) {
        points.push({ x: centerX - width / 2 + x, y: centerY - height / 2 + y });
      }
    }
  }
  
  return points;
}

export function generateBuildingShape(centerX: number, centerY: number, scale = 1): Point[] {
  const points: Point[] = [];
  const w = 120 * scale;
  const h = 180 * scale;
  const spacing = 4;
  
  // Building outline
  for (let y = 0; y < h; y += spacing) {
    points.push({ x: centerX - w / 2, y: centerY - h / 2 + y });
    points.push({ x: centerX + w / 2, y: centerY - h / 2 + y });
  }
  for (let x = 0; x < w; x += spacing) {
    points.push({ x: centerX - w / 2 + x, y: centerY - h / 2 });
    points.push({ x: centerX - w / 2 + x, y: centerY + h / 2 });
  }
  
  // Windows grid
  const rows = 8;
  const cols = 4;
  const windowW = 15 * scale;
  const windowH = 12 * scale;
  const startX = centerX - (cols * windowW + (cols - 1) * 8 * scale) / 2;
  const startY = centerY - h / 2 + 20 * scale;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const wx = startX + col * (windowW + 8 * scale);
      const wy = startY + row * (windowH + 8 * scale);
      for (let x = 0; x < windowW; x += spacing) {
        for (let y = 0; y < windowH; y += spacing) {
          if (Math.random() > 0.5) {
            points.push({ x: wx + x, y: wy + y });
          }
        }
      }
    }
  }
  
  return points;
}

export function generateNetworkShape(centerX: number, centerY: number, scale = 1): Point[] {
  const points: Point[] = [];
  const radius = 25 * scale;
  const spacing = 3;
  
  // Three nodes in a flow pattern
  const nodes = [
    { x: centerX - 80 * scale, y: centerY },
    { x: centerX, y: centerY },
    { x: centerX + 80 * scale, y: centerY },
  ];
  
  // Draw circles for nodes
  nodes.forEach(node => {
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      for (let r = 0; r < radius; r += spacing) {
        points.push({
          x: node.x + Math.cos(angle) * r,
          y: node.y + Math.sin(angle) * r,
        });
      }
    }
  });
  
  // Connection lines between nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i];
    const to = nodes[i + 1];
    const steps = 40;
    for (let t = 0; t <= steps; t++) {
      const progress = t / steps;
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      // Add thickness to lines
      for (let offset = -2; offset <= 2; offset++) {
        points.push({ x, y: y + offset * scale });
      }
    }
  }
  
  // Arrow heads on connections
  nodes.slice(1).forEach((node, i) => {
    const arrowSize = 12 * scale;
    for (let dy = -arrowSize; dy <= 0; dy += spacing) {
      const width = (arrowSize + dy) * 0.5;
      for (let dx = -width; dx <= width; dx += spacing) {
        points.push({ x: node.x - radius + dx, y: node.y + dy });
      }
    }
  });
  
  return points;
}

export function generatePhoneShape(centerX: number, centerY: number, scale = 1): Point[] {
  const points: Point[] = [];
  const w = 80 * scale;
  const h = 140 * scale;
  const radius = 15 * scale;
  const spacing = 3;
  
  // Phone outline (rounded rectangle)
  for (let y = radius; y < h - radius; y += spacing) {
    points.push({ x: centerX - w / 2, y: centerY - h / 2 + y });
    points.push({ x: centerX + w / 2, y: centerY - h / 2 + y });
  }
  for (let x = radius; x < w - radius; x += spacing) {
    points.push({ x: centerX - w / 2 + x, y: centerY - h / 2 });
    points.push({ x: centerX - w / 2 + x, y: centerY + h / 2 });
  }
  
  // Rounded corners
  const corners = [
    { cx: centerX - w / 2 + radius, cy: centerY - h / 2 + radius, start: Math.PI, end: Math.PI * 1.5 },
    { cx: centerX + w / 2 - radius, cy: centerY - h / 2 + radius, start: Math.PI * 1.5, end: Math.PI * 2 },
    { cx: centerX - w / 2 + radius, cy: centerY + h / 2 - radius, start: Math.PI * 0.5, end: Math.PI },
    { cx: centerX + w / 2 - radius, cy: centerY + h / 2 - radius, start: 0, end: Math.PI * 0.5 },
  ];
  
  corners.forEach(corner => {
    for (let angle = corner.start; angle <= corner.end; angle += 0.1) {
      points.push({
        x: corner.cx + Math.cos(angle) * radius,
        y: corner.cy + Math.sin(angle) * radius,
      });
    }
  });
  
  // Screen
  const screenW = w - 20 * scale;
  const screenH = h - 40 * scale;
  for (let y = 0; y < screenH; y += spacing) {
    for (let x = 0; x < screenW; x += spacing) {
      if (Math.random() > 0.7) {
        points.push({ x: centerX - screenW / 2 + x, y: centerY - screenH / 2 + y });
      }
    }
  }
  
  // Home button
  const buttonRadius = 8 * scale;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    for (let r = 0; r < buttonRadius; r += spacing) {
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + h / 2 - 20 * scale + Math.sin(angle) * r,
      });
    }
  }
  
  return points;
}
