import { useState } from "react";
import Icon from "@/components/ui/icon";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "навсегда",
    emoji: "🌱",
    color: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.1)",
    features: [
      "До 10 чатов",
      "Базовая лента",
      "1 ГБ хранилища",
      "Стандартные эмодзи",
    ],
    disabled: ["Группы и каналы", "Приоритет в поиске", "Эксклюзивные темы", "Бейдж Verified"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "299",
    period: "в месяц",
    emoji: "⚡",
    color: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))",
    border: "rgba(139,92,246,0.4)",
    popular: true,
    features: [
      "Безлимитные чаты",
      "Группы до 500 человек",
      "Создание каналов",
      "50 ГБ хранилища",
      "Приоритет в поиске",
      "Эксклюзивные темы",
    ],
    disabled: ["Бейдж Verified", "Корпоративный API"],
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "799",
    period: "в месяц",
    emoji: "🚀",
    color: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(236,72,153,0.15))",
    border: "rgba(249,115,22,0.4)",
    features: [
      "Всё из Pro",
      "Бейдж Verified ✓",
      "Группы до 100К человек",
      "500 ГБ хранилища",
      "Корпоративный API",
      "Приоритетная поддержка",
    ],
    disabled: [],
  },
];

const DONATION_URL = "https://www.donationalerts.com/r/yanfool1";

export default function SubscriptionPage() {
  const [currentPlan] = useState("free");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [savedCard, setSavedCard] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    window.open(DONATION_URL, "_blank");
  };

  const saveCard = () => {
    if (cardNumber.replace(/\s/g, "").length === 16) {
      setSavedCard("•••• •••• •••• " + cardNumber.replace(/\s/g, "").slice(-4));
      setShowCardForm(false);
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-montserrat font-bold gradient-text mb-1">Подписка</h2>
          <p className="text-sm text-muted-foreground">Выбери план и раскрой возможности VIBE</p>
        </div>

        <div className="space-y-3 mb-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: plan.color,
                border: `1px solid ${plan.border}`,
                boxShadow: plan.popular ? `0 0 30px rgba(139,92,246,0.15)` : undefined,
              }}
            >
              {plan.popular && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                    Популярный
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{plan.emoji}</span>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-montserrat font-black gradient-text">{plan.price}₽</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={14} className="text-green-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
                {plan.disabled.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                    <Icon name="X" size={14} className="flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {currentPlan === plan.id ? (
                <div className="py-2 text-center text-sm font-semibold text-muted-foreground">
                  ✓ Текущий план
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={plan.id === "ultra"
                    ? { background: 'linear-gradient(135deg, #F97316, #EC4899)' }
                    : { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }
                  }
                >
                  Подключить {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Icon name="CreditCard" size={18} className="text-purple-400" />
              Способ оплаты
            </h3>
            <button
              onClick={() => setShowCardForm(!showCardForm)}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {savedCard ? "Изменить" : "Добавить"}
            </button>
          </div>

          {savedCard ? (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-10 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                💳
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{savedCard}</div>
                <div className="text-xs text-muted-foreground">Основная карта</div>
              </div>
              <button
                onClick={() => { setSavedCard(null); setShowCardForm(false); }}
                className="ml-auto p-1 text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Карта не привязана</p>
          )}

          {showCardForm && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <div className="glass rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.05))' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Номер карты</div>
                  <div className="text-xl">💳</div>
                </div>
                <div className="text-lg font-montserrat font-bold text-foreground tracking-widest mb-2">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{cardExpiry || "MM/YY"}</span>
                  <span>{cardCvc ? "•••" : "CVC"}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Номер карты</label>
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors font-montserrat tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Срок действия</label>
                  <input
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">CVC</label>
                  <input
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="•••"
                    type="password"
                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={saveCard}
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white neon-glow"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                {selectedPlan ? `Оплатить и подключить ${PLANS.find(p => p.id === selectedPlan)?.name}` : "Сохранить карту"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                🔒 Данные зашифрованы и защищены
              </p>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Zap" size={18} className="text-yellow-400" />
            Что входит в Pro
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {["Группы до 500 чел.", "Создание каналов", "50 ГБ облако", "Приоритет поиска", "Темы оформления", "Расширенная аналитика"].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}