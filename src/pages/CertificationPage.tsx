import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertTriangle } from 'lucide-react';
import type { CertificationQuestionnaireInput, CertificationAssessment } from '@/types';
import { certificationService } from '@/services';
import { CERTIFICATION_STEPS, PRODUCT_CATEGORIES, MANUFACTURER_TYPES, INTENDED_MARKETS, TESTING_STATUS_OPTIONS } from '@/data/constants';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingState } from '@/components/shared/state-components';
import { DemoBadge, DisclaimerBanner, VerificationNotice } from '@/components/shared/trust-badges';
import { DISCLAIMER_SHORT } from '@/data/constants';

// ============================================================
// Certification Guide page
// ============================================================

export function CertificationPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'guide' | 'form' | 'result'>('guide');
  const [formData, setFormData] = useState<CertificationQuestionnaireInput>({
    productName: '',
    productCategory: '',
    manufacturerType: '',
    intendedMarket: '',
    existingStandard: '',
    testingStatus: '',
  });
  const [assessment, setAssessment] = useState<CertificationAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await certificationService.submitAssessment(formData);
    if (result.data) {
      setAssessment(result.data);
      setView('result');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">BIS Certification Guide</h1>
        <p className="text-sm text-muted-foreground">
          Understand the BIS certification process and check your certification readiness.
        </p>
      </div>

      <DisclaimerBanner message={DISCLAIMER_SHORT} className="mb-6" />

      {view === 'guide' && (
        <CertificationStepsView onStartCheck={() => setView('form')} />
      )}

      {view === 'form' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Certification Check Questionnaire</h2>
            <Button variant="ghost" size="sm" onClick={() => setView('guide')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Guide
            </Button>
          </div>

          {loading ? (
            <LoadingState message="Analyzing your inputs…" />
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Product Name" required>
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Electric kettle"
                    required
                  />
                </FormField>

                <FormField label="Product Category" required>
                  <Select value={formData.productCategory} onValueChange={(v) => setFormData({ ...formData, productCategory: v })}>
                    <SelectTrigger required><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Manufacturer Type" required>
                  <Select value={formData.manufacturerType} onValueChange={(v) => setFormData({ ...formData, manufacturerType: v })}>
                    <SelectTrigger required><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {MANUFACTURER_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Intended Market" required>
                  <Select value={formData.intendedMarket} onValueChange={(v) => setFormData({ ...formData, intendedMarket: v })}>
                    <SelectTrigger required><SelectValue placeholder="Select market" /></SelectTrigger>
                    <SelectContent>
                      {INTENDED_MARKETS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Existing Standard (if known)">
                  <Input
                    value={formData.existingStandard}
                    onChange={(e) => setFormData({ ...formData, existingStandard: e.target.value })}
                    placeholder="e.g. IS-XXXX"
                  />
                </FormField>

                <FormField label="Testing Status" required>
                  <Select value={formData.testingStatus} onValueChange={(v) => setFormData({ ...formData, testingStatus: v })}>
                    <SelectTrigger required><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {TESTING_STATUS_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <Button type="submit" size="lg" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Certification Assessment
                </Button>
              </form>
            </Card>
          )}
        </div>
      )}

      {view === 'result' && assessment && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Certification Assessment</h2>
            <Button variant="ghost" size="sm" onClick={() => setView('form')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Edit Inputs
            </Button>
          </div>

          {/* Status banner */}
          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">Awaiting AI/BIS Knowledge Verification</p>
                <DemoBadge />
              </div>
              <p className="text-sm text-muted-foreground">{assessment.summary}</p>
            </div>
          </div>

          {/* Input summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Your Inputs</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(assessment.input).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="text-foreground">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Suggested steps */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Suggested Next Steps</h3>
            <ul className="space-y-3">
              {assessment.suggestedSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </Card>

          <VerificationNotice />

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/standards-finder')}>
              <ArrowRight className="h-4 w-4 mr-2" /> Find Applicable Standard
            </Button>
            <Button variant="outline" onClick={() => navigate('/laboratories')}>
              Find Laboratory
            </Button>
            <Button variant="outline" onClick={() => navigate('/assistant')}>
              Ask Assistant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Stepper view
// ============================================================

function CertificationStepsView({ onStartCheck }: { onStartCheck: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function handleNext() {
    setCompleted((prev) => new Set(prev).add(activeStep));
    if (activeStep < CERTIFICATION_STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    }
  }

  function handlePrev() {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="hidden md:flex items-center justify-between mb-6">
        {CERTIFICATION_STEPS.map((step, i) => {
          const isCompleted = completed.has(i);
          const isActive = i === activeStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setActiveStep(i)}
                className="flex flex-col items-center gap-1.5 group"
                aria-label={step.title}
              >
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold border-2 transition-colors',
                  isCompleted && 'bg-success text-success-foreground border-success',
                  isActive && !isCompleted && 'bg-primary text-primary-foreground border-primary',
                  !isActive && !isCompleted && 'bg-card text-muted-foreground border-border group-hover:border-primary/40',
                )}>
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className={cn('text-xs font-medium text-center max-w-[80px]', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                  {step.title}
                </span>
              </button>
              {i < CERTIFICATION_STEPS.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2 -mt-5', isCompleted ? 'bg-success' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step indicator */}
      <div className="md:hidden flex items-center justify-between">
        <span className="text-sm font-medium">Step {activeStep + 1} of {CERTIFICATION_STEPS.length}</span>
        <DemoBadge />
      </div>

      {/* Active step content */}
      <Card className="p-6">
        {(() => {
          const step = CERTIFICATION_STEPS[activeStep];
          const Icon = getIcon(step.icon);
          return (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Step {step.id}</p>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-2 mb-6">
                {step.details.map((detail, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={activeStep === 0}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                {activeStep < CERTIFICATION_STEPS.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={onStartCheck}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Start Certification Check
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Start check CTA */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={onStartCheck}>
          <Sparkles className="h-4 w-4 mr-2" />
          Start Certification Check
        </Button>
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
