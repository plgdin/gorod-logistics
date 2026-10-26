import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Info,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { formatINR } from '../features/tariff-calculator/calculations';

const enquirySchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  companyName: z.string().min(2, 'Please enter your company or freight agency name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid contact phone number'),
  cargoType: z.enum(['air', 'sea', 'general'], {
    errorMap: () => ({ message: 'Please select a cargo classification' }),
  }),
  requiredService: z.string().min(1, 'Please select your primary service requirement'),
  cargoMetric: z.string().min(1, 'Please specify consignment weight (kg) or area (m²)'),
  storageDuration: z.string().min(1, 'Please indicate anticipated storage duration'),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  const initialCargoType = searchParams.get('cargoType') === 'sea' ? 'sea' : searchParams.get('cargoType') === 'air' ? 'air' : 'general';
  const initialWeight = searchParams.get('weight');
  const initialArea = searchParams.get('area');
  const initialDuration = searchParams.get('duration');
  const initialEstimate = searchParams.get('estimate');

  const defaultMetric = initialWeight ? `${initialWeight} kg` : initialArea ? `${initialArea} m²` : '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      cargoType: initialCargoType,
      requiredService: initialCargoType === 'air' ? 'Air Cargo Bonded Storage' : initialCargoType === 'sea' ? 'Covered Sea Freight Storage' : 'Bonded Warehousing Consultation',
      cargoMetric: defaultMetric,
      storageDuration: initialDuration || '',
      message: initialEstimate ? `Estimated published tariff quote: ${formatINR(Number(initialEstimate))}. Please confirm space allocation and proforma formalities.` : '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    // Simulate brief client-side network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmittedData(data);
    setIsSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact &amp; Consignment Enquiries"
        description="Submit your customs-bonded cargo enquiry, space reservation, or quotation request to Gorod Logistics in Thiruvananthapuram, Kerala."
      />

      <PageHeader
        badge="Enquiries &amp; Quotations"
        title="Contact Our Operations Desk"
        description="Connect with our bonded warehouse operations team in Thiruvananthapuram for storage reservations, proforma quotations, and customs documentation assistance."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Operational Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
                Facility &amp; Coordination
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Gorod Logistics Operations
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Operating under Indian Customs regulations, our warehouse reception coordinates bonded cargo admissions, destuffing, and customs release handovers.
              </p>
            </div>

            {/* Verified Address & Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Customs-Bonded Warehouse Location</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Thiruvananthapuram, Kerala, India
                    <span className="block text-slate-400 mt-0.5">
                      [Official street address &amp; customs bond station code issued to accredited consignees upon documentation review]
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Operating Schedule</div>
                  <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                    <div>Warehouse Staging: Monday – Saturday (09:00 – 18:00 IST)</div>
                    <div>Customs Clearance &amp; Escorts: Subject to Customs Officer Attendance</div>
                    <div>Round-the-clock physical security &amp; bonded perimeter controls</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Regulatory Compliance</div>
                  <div className="text-xs text-slate-600 mt-1">
                    Customs Act 1962 &bull; Central Board of Indirect Taxes and Customs (CBIC) Public Bonded Warehouse Regulations.
                  </div>
                </div>
              </div>
            </div>

            {/* Initial Estimate Banner if referred from calculator */}
            {initialEstimate && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 space-y-2 text-xs text-blue-900">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Calculator Reference Attached</span>
                </div>
                <p>
                  Your preliminary estimate of <strong>{formatINR(Number(initialEstimate))}</strong> has been linked into this enquiry. Our desk will confirm warehouse bay availability and customs into-bond processing.
                </p>
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              {isSubmitted && submittedData ? (
                <div className="py-8 space-y-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Enquiry Submitted Successfully</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you, <strong className="text-slate-900">{submittedData.fullName}</strong>. Your enquiry for <strong className="text-slate-900">{submittedData.companyName}</strong> regarding {submittedData.cargoType.toUpperCase()} cargo has been logged.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1 max-w-md mx-auto">
                    <div className="font-semibold text-slate-900">Enquiry Summary:</div>
                    <div>&bull; Service: {submittedData.requiredService}</div>
                    <div>&bull; Weight / Metric: {submittedData.cargoMetric}</div>
                    <div>&bull; Storage Duration: {submittedData.storageDuration}</div>
                    <div>&bull; Contact Phone: {submittedData.phone}</div>
                    <div>&bull; Email: {submittedData.email}</div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs text-left max-w-md mx-auto">
                    <strong>Phase 1 Notice:</strong> This enquiry is currently stored locally in your active session. Once email integration (Phase 2) is activated, transmissions will dispatch proformas directly to client inboxes.
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmittedData(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Submit Another Consignment Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Consignment Quotation &amp; Space Request</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out your consignment metrics below for proforma evaluation.
                    </p>
                  </div>

                  {/* Name and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        {...register('fullName')}
                        placeholder="e.g. Ramesh Menon"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company / CB Agency <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        {...register('companyName')}
                        placeholder="e.g. Kerala Freight Express Ltd"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.companyName && (
                        <p className="text-xs text-rose-600 mt-1">{errors.companyName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Official Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="operations@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone / Mobile <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Cargo Classification & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cargoType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Cargo Classification <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="cargoType"
                        {...register('cargoType')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      >
                        <option value="air">Air Cargo Consignment</option>
                        <option value="sea">Sea Freight (20ft / 40ft / LCL)</option>
                        <option value="general">General Bonded Warehousing Enquiry</option>
                      </select>
                      {errors.cargoType && (
                        <p className="text-xs text-rose-600 mt-1">{errors.cargoType.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="requiredService" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Required Service Scope <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="requiredService"
                        {...register('requiredService')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      >
                        <option value="Customs Bonded Storage">Customs Bonded Storage</option>
                        <option value="Inward & Outward Handling (3 MT Forklift)">Inward &amp; Outward Handling (3 MT Forklift)</option>
                        <option value="Part-Delivery Clearance">Part-Delivery Clearance</option>
                        <option value="Bonding & Debonding Formalities">Bonding &amp; Debonding Formalities</option>
                        <option value="Comprehensive Package (Intake, Storage, Handover)">Comprehensive Package (Intake, Storage, Handover)</option>
                        <option value="Special Cargo (Hazardous / Temperature / Valuable)">Special Cargo (+30% Surcharge)</option>
                      </select>
                      {errors.requiredService && (
                        <p className="text-xs text-rose-600 mt-1">{errors.requiredService.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Weight / Area & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cargoMetric" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Cargo Weight (kg) or Area (m²) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="cargoMetric"
                        type="text"
                        {...register('cargoMetric')}
                        placeholder="e.g. 500 kg or 25 m²"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.cargoMetric && (
                        <p className="text-xs text-rose-600 mt-1">{errors.cargoMetric.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="storageDuration" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Expected Storage Duration <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="storageDuration"
                        type="text"
                        {...register('storageDuration')}
                        placeholder="e.g. 2 weeks (Air) / 4 weeks (Sea)"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                      {errors.storageDuration && (
                        <p className="text-xs text-rose-600 mt-1">{errors.storageDuration.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Specific Instructions or Bill of Entry Details (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      {...register('message')}
                      placeholder="Include into-bond BOE status, commodity description, special pallet dimensions, or customs examination timing..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    ></textarea>
                    {errors.message && (
                      <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verifying Enquiry...' : 'Submit Consignment Enquiry'}</span>
                  </button>

                  <div className="text-[11px] text-slate-400 text-center">
                    Submission processes locally in Phase 1 demo mode. Official proforma agreements are executed directly with Gorod Logistics customs desk.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
