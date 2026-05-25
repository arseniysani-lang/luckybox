import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const body = await req.json();
  const { name, phone, marketplace, delivery, warehouse, units, boxes, services, deliveryCost, servicesCost, total, perUnit } = body;

  const servicesList = services?.length
    ? services.map((s: { name: string; cost: number }) => `  • ${s.name}: ${s.cost.toLocaleString('ru-RU')} ₽`).join('\n')
    : '  —';

  const text = `🆕 Новая заявка с калькулятора

👤 Имя: ${name}
📱 Телефон: ${phone}

📦 Маркетплейс: ${marketplace}
🚚 Доставка: ${delivery}
🏭 Склад: ${warehouse} — ${deliveryCost?.toLocaleString('ru-RU')} ₽
📊 Единиц товара: ${units}
📫 Коробов: ${boxes}

🔧 Услуги:
${servicesList}

💰 Услуги итого: ${servicesCost?.toLocaleString('ru-RU')} ₽
💳 Итого: ${total?.toLocaleString('ru-RU')} ₽
📐 За единицу: ${perUnit} ₽`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Telegram error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
