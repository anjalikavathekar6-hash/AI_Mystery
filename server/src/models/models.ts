import mongoose, { Schema } from 'mongoose';

const MysteryCaseSchema = new Schema({
  title: { type: String, required: true }, scenario: { type: String, required: true }, category: String, difficulty: String, status: { type: String, default: 'ready' },
  publicCase: { type: Schema.Types.Mixed, required: true }, privateSolution: { type: Schema.Types.Mixed, required: true },
  generationMetadata: { model: String, generatedAt: Date }, expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 86400000), index: { expires: 0 } }
}, { timestamps: true });

const InvestigationSessionSchema = new Schema({
  caseId: { type: Schema.Types.ObjectId, ref: 'MysteryCase', required: true, index: true },
  sessionTokenHash: { type: String, required: true }, reviewedEvidenceIds: { type: [String], default: [] }, notes: { type: [String], default: [] },
  status: { type: String, enum: ['investigating','revealed'], default: 'investigating' }, accusation: Schema.Types.Mixed, result: Schema.Types.Mixed,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 86400000), index: { expires: 0 } }
}, { timestamps: true });

export const MysteryCase = mongoose.models.MysteryCase || mongoose.model('MysteryCase', MysteryCaseSchema);
export const InvestigationSession = mongoose.models.InvestigationSession || mongoose.model('InvestigationSession', InvestigationSessionSchema);
