import { X, ArrowRight, Package, Hash, Calendar, ArrowDownCircle, ArrowUpCircle, ListOrdered } from 'lucide-react';
import type { DeductionReplayData } from '@/types';
import { formatDate } from '@/utils/inventoryCalculator';

interface DeductionReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  replayData: DeductionReplayData | null;
}

export function DeductionReplayModal({ isOpen, onClose, replayData }: DeductionReplayModalProps) {
  if (!isOpen || !replayData) return null;

  const totalStockBefore = replayData.skuStockBefore;
  const totalStockAfter = replayData.skuStockAfter;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl shadow-cyan-500/10 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <ListOrdered size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">扣减明细回放</h3>
              <p className="text-xs text-slate-400">先进先出执行轨迹追溯</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                <Package size={12} />
                商品
              </div>
              <div className="text-sm font-semibold text-slate-100">{replayData.skuName}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                <Hash size={12} />
                出库数量
              </div>
              <div className="text-sm font-semibold text-cyan-400 font-mono">{replayData.totalQuantity} 件</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                <Calendar size={12} />
                操作时间
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {formatDate(replayData.createdAt)} {new Date(replayData.createdAt).toLocaleTimeString('zh-CN')}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
          <div className="space-y-3">
            {replayData.details.map((detail, index) => (
              <div
                key={detail.batchId}
                className="relative p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200"
              >
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-xs font-bold text-white">{detail.sequence}</span>
                </div>

                <div className="ml-8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-slate-100">{detail.batchNo}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          生产: {formatDate(detail.productionDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">扣减顺序</span>
                      <span className="text-sm font-bold text-cyan-400">#{detail.sequence}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-1 text-xs text-emerald-400 mb-1">
                        <ArrowDownCircle size={12} />
                        扣减前库存
                      </div>
                      <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
                        {detail.stockBefore}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <ArrowRight size={20} className="text-slate-500" />
                      <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                        <span className="text-sm font-mono font-bold text-cyan-400">-{detail.deductQuantity}</span>
                      </div>
                      <ArrowRight size={20} className="text-slate-500" />
                    </div>

                    <div className="flex-1 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-center gap-1 text-xs text-orange-400 mb-1">
                        <ArrowUpCircle size={12} />
                        扣减后库存
                      </div>
                      <div className="text-xl font-mono font-bold text-orange-400 tabular-nums">
                        {detail.stockAfter}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${detail.stockBefore > 0 ? ((detail.stockBefore - detail.deductQuantity) / detail.stockBefore) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>0</span>
                    <span>剩余 {detail.stockAfter} / 原 {detail.stockBefore}</span>
                    <span>{detail.stockBefore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-400">扣减前总库存</span>
                <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">{totalStockBefore}</div>
              </div>
              <div className="text-2xl text-slate-500">-</div>
              <div>
                <span className="text-xs text-slate-400">本次出库</span>
                <div className="text-lg font-mono font-bold text-cyan-400 tabular-nums">{replayData.totalQuantity}</div>
              </div>
              <div className="text-2xl text-slate-500">=</div>
              <div>
                <span className="text-xs text-slate-400">扣减后总库存</span>
                <div className="text-lg font-mono font-bold text-orange-400 tabular-nums">{totalStockAfter}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
