"use client";

import { useState, useEffect } from "react";

interface RaceData {
  name: string;
  value: number;
  color: string;
}

const initialData: RaceData[] = [
  { name: "전자제품", value: 120, color: "bg-blue-500" },
  { name: "의류", value: 95, color: "bg-green-500" },
  { name: "도서", value: 80, color: "bg-purple-500" },
  { name: "가구", value: 65, color: "bg-yellow-500" },
  { name: "스포츠", value: 50, color: "bg-red-500" },
  { name: "뷰티", value: 40, color: "bg-pink-500" },
  { name: "식품", value: 30, color: "bg-orange-500" },
];

export default function ChartPage() {
  const [data, setData] = useState(initialData);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        if (prev >= 12) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 1;
      });

      setData(prevData => 
        prevData.map(item => ({
          ...item,
          value: Math.max(10, item.value + (Math.random() - 0.5) * 40)
        })).sort((a, b) => b.value - a.value)
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const maxValue = Math.max(...data.map(d => d.value));

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentMonth(1);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">차트 레이스</h1>
        <p className="text-neutral-400">카테고리별 판매량 경쟁</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">2024년 {currentMonth}월</h2>
              <p className="text-neutral-400">카테고리별 판매량</p>
            </div>
            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isPlaying ? '일시정지' : '시작'}
            </button>
          </div>

          <div className="space-y-4">
            {data.map((item, index) => (
              <div 
                key={item.name}
                className="flex items-center gap-4 transition-all duration-1000 ease-in-out"
                style={{ 
                  transform: `translateY(${index * 0}px)`,
                  zIndex: data.length - index 
                }}
              >
                <div className="w-8 text-right font-bold text-lg">
                  #{index + 1}
                </div>
                
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-20 text-sm font-medium truncate">
                    {item.name}
                  </div>
                  
                  <div className="flex-1 bg-neutral-700 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                      style={{ 
                        width: `${(item.value / maxValue) * 100}%`,
                        minWidth: '60px'
                      }}
                    >
                      <span className="text-white font-bold text-sm">
                        {Math.round(item.value)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-700">
            <div className="text-sm text-neutral-400 text-center">
              순위는 실시간으로 변동됩니다
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">통계 요약</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-700 p-3 rounded text-center">
              <div className="text-xl font-bold text-blue-500">{data.length}</div>
              <div className="text-xs text-neutral-400">총 카테고리</div>
            </div>
            <div className="bg-neutral-700 p-3 rounded text-center">
              <div className="text-xl font-bold text-green-500">
                {Math.round(data.reduce((sum, item) => sum + item.value, 0))}
              </div>
              <div className="text-xs text-neutral-400">총 판매량</div>
            </div>
            <div className="bg-neutral-700 p-3 rounded text-center">
              <div className="text-xl font-bold text-orange-500">
                {Math.round(maxValue)}
              </div>
              <div className="text-xs text-neutral-400">최고 판매량</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}