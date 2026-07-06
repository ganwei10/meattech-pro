'use client';

import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

interface LineData {
  id: number;
  name: string;
  region: string;
  status: string;
  type: string;
  capacity: string;
  equipment: string;
  advantages: string;
  cooperationModel: string;
  pricePerDay: number;
  serviceFeePercent: number;
}

interface TypeConfigItem {
  label: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
  model: string;
  sectionTitle: string;
}

interface CardLabels {
  available: string;
  booked: string;
  advantages: string;
  equipment: string;
  cooperation: string;
  bookBtn: string;
  capacityFallback: string;
}

interface PilotMapTabsProps {
  regions: string[];
  regionMap: Record<string, LineData[]>;
  typeConfig: Record<string, TypeConfigItem>;
  cardLabels: CardLabels;
}

export default function PilotMapTabs({ regions, regionMap, typeConfig, cardLabels }: PilotMapTabsProps) {
  const [activeRegion, setActiveRegion] = useState(regions[0] || '');

  if (regions.length === 0) return null;

  const currentLines = regionMap[activeRegion] || [];
  const universities = currentLines.filter(l => l.type === 'UNIVERSITY' || (!l.type && l.name.includes('大学')));
  const parks = currentLines.filter(l => l.type === 'PARK');
  const enterprises = currentLines.filter(l => l.type === 'ENTERPRISE');
  const others = currentLines.filter(l => l.type !== 'UNIVERSITY' && l.type !== 'PARK' && l.type !== 'ENTERPRISE' && !l.name.includes('大学'));

  return (
    <div>
      {/* Region tabs — horizontal scroll on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ flexWrap: 'nowrap' }}>
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className="px-5 py-2 rounded-full border-none cursor-pointer text-sm font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeRegion === r ? '#1E3A8A' : '#fff',
              color: activeRegion === r ? '#fff' : '#374151',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              flexShrink: 0,
            }}
          >
            {r} ({(regionMap[r] || []).length})
          </button>
        ))}
      </div>

      {/* Institutions by type within the selected region */}
      {universities.length > 0 && (
        <SectionBlock title={typeConfig.UNIVERSITY?.sectionTitle || '高校及科研院所'} config={typeConfig.UNIVERSITY} lines={universities} cardLabels={cardLabels} />
      )}
      {parks.length > 0 && (
        <SectionBlock title={typeConfig.PARK?.sectionTitle || '产业园与公共服务平台'} config={typeConfig.PARK} lines={parks} cardLabels={cardLabels} />
      )}
      {enterprises.length > 0 && (
        <SectionBlock title={typeConfig.ENTERPRISE?.sectionTitle || '辅料及添加剂企业演示中心'} config={typeConfig.ENTERPRISE} lines={enterprises} cardLabels={cardLabels} />
      )}
      {others.length > 0 && (
        <SectionBlock title={typeConfig.OTHER?.sectionTitle || '其他中试产线'} config={typeConfig.OTHER || { label: '其他', icon: '📦', color: '#374151', bg: '#F3F4F6', desc: '已入驻的共享产线资源', model: '', sectionTitle: '其他中试产线' }} lines={others} cardLabels={cardLabels} />
      )}
    </div>
  );
}

function SectionBlock({ title, config, lines, cardLabels }: { title: string; config: TypeConfigItem; lines: LineData[]; cardLabels: CardLabels }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0" style={{ background: config.bg }}>{config.icon}</div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-2xl font-extrabold m-0" style={{ color: config.color }}>{title}</h2>
          <p className="text-xs md:text-sm text-[#6B7280] m-0 mt-1">{config.desc}</p>
        </div>
        {config.model && (
          <div className="ml-auto text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap" style={{ background: config.bg, color: config.color }}>
            {config.model}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lines.map(line => (
          <PilotCard key={line.id} line={line} config={config} cardLabels={cardLabels} />
        ))}
      </div>
    </div>
  );
}

function PilotCard({ line, config, cardLabels }: { line: LineData; config: TypeConfigItem; cardLabels: CardLabels }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: config.bg, color: config.color }}>
            {config.icon} {config.label}
          </span>
          <span style={{
            padding: '3px 8px', borderRadius: 12, fontSize: '.72rem', fontWeight: 600,
            background: line.status === 'AVAILABLE' ? '#D1FAE5' : '#FEF3C7',
            color: line.status === 'AVAILABLE' ? '#065F46' : '#92400E',
          }}>
            ● {line.status === 'AVAILABLE' ? cardLabels.available : cardLabels.booked}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', lineHeight: 1.4, margin: 0, flex: 1 }}>{line.name}</h3>
          <FavoriteButton targetType="PILOT_LINE" targetId={line.id} />
        </div>
        <div style={{ fontSize: '.8rem', color: '#9CA3AF', marginBottom: 12 }}>📍 {line.region} · {line.capacity || cardLabels.capacityFallback}</div>
      </div>

      {line.advantages && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>{cardLabels.advantages}</div>
          <p style={{ fontSize: '.85rem', color: '#374151', lineHeight: 1.6 }}>{line.advantages.length > 120 ? line.advantages.slice(0, 120) + '...' : line.advantages}</p>
        </div>
      )}

      {line.equipment && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>{cardLabels.equipment}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {line.equipment.split(',').slice(0, 4).map((eq: string, i: number) => (
              <span key={i} style={{ fontSize: '.72rem', padding: '2px 8px', borderRadius: 4, background: '#F3F4F6', color: '#374151' }}>{eq.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {line.cooperationModel && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>{cardLabels.cooperation}</div>
          <p style={{ fontSize: '.82rem', color: line.cooperationModel.includes('CRO') ? '#1E3A8A' : line.cooperationModel.includes('场租') ? '#065F46' : '#92400E', lineHeight: 1.5, fontWeight: 500 }}>
            {line.cooperationModel.length > 80 ? line.cooperationModel.slice(0, 80) + '...' : line.cooperationModel}
          </p>
        </div>
      )}

      {line.pricePerDay > 0 && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <span style={{ fontSize: '.85rem', color: '#059669', fontWeight: 700 }}>💰 ¥{line.pricePerDay.toLocaleString()}/天</span>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '0 20px 20px 20px', display: 'flex', gap: 8 }}>
        <Link href={`/booking/${line.id}`} style={{
          flex: 1, textAlign: 'center', padding: '10px 0',
          background: '#1E3A8A', color: '#fff', borderRadius: 8, fontSize: '.88rem',
          textDecoration: 'none', fontWeight: 600,
        }}>
          {cardLabels.bookBtn}
        </Link>
      </div>
    </div>
  );
}
