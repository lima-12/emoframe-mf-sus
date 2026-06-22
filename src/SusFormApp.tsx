import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calcularScoreSus } from './calcularScoreSus';

interface Props {
  onComplete: (data: any) => void;
}

// Cores extraídas do tema do EmoFrame (host), para manter a mesma identidade visual
const PRIMARY_COLOR = '#6EA05A';
const PRIMARY_LIGHT = '#D2EEC9';
const PRIMARY_TEXT_ON_PRIMARY = '#FCFCFC';
const CONTENT_COLOR = 'hsl(210, 3%, 30%)';
const ERROR_COLOR = '#EF4444';

const susQuestions = [
  { field: "use_frequency", label: "Eu acho que gostaria de usar esse sistema com frequência." },
  { field: "use_complex", label: "Eu acho o sistema desnecessariamente complexo." },
  { field: "use_easy", label: "Eu achei o sistema fácil de usar." },
  { field: "need_help", label: "Eu acho que precisaria do suporte de um técnico para poder usar esse sistema." },
  { field: "function_integration", label: "Eu achei que as várias funções desse sistema estão muito bem integradas." },
  { field: "inconsistency", label: "Eu achei que existe muita inconsistência neste sistema." },
  { field: "learning_curve", label: "Eu imagino que a maioria das pessoas aprenderia a usar esse sistema muito rapidamente." },
  { field: "jumbled", label: "Eu achei o sistema muito confuso de se usar." },
  { field: "confidence", label: "Eu me senti muito confiante usando o sistema." },
  { field: "learn_system", label: "Eu precisei aprender várias coisas novas antes de conseguir usar o sistema." }
];

// Mesmos rótulos da escala usada pelo SusForm.tsx legado (host)
const DefaultProps = [
  { value: '5', label: 'Concordo Fortemente' },
  { value: '4', label: 'Concordo Parcialmente' },
  { value: '3', label: 'Neutro' },
  { value: '2', label: 'Discordo Parcialmente' },
  { value: '1', label: 'Discordo Fortemente' },
];

const SusFormSchema = z.object(
  Object.fromEntries(
    susQuestions.map(item => [
      item.field,
      z.enum(
        [DefaultProps[0].value, ...DefaultProps.slice(1).map((p) => p.value)] as [string, ...string[]],
        { message: "Escolha uma opção" }
      )
    ])
  )
);

export default function SusFormApp({ onComplete }: Props) {
  const form = useForm<z.infer<typeof SusFormSchema>>({
    resolver: zodResolver(SusFormSchema),
    defaultValues: {
      use_frequency: '',
      use_complex: '',
      use_easy: '',
      need_help: '',
      function_integration: '',
      inconsistency: '',
      learning_curve: '',
      jumbled: '',
      confidence: '',
      learn_system: '',
    } as any,
  });

  const onSubmit = (values: z.infer<typeof SusFormSchema>) => {
    const score = calcularScoreSus(values);
    onComplete({ answers: values, score });
  };

  const { formState: { errors } } = form;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <style>{`
        .sus-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          background-color: ${PRIMARY_COLOR};
          color: ${PRIMARY_TEXT_ON_PRIMARY};
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .sus-btn:hover {
          background-color: ${PRIMARY_LIGHT};
          color: ${CONTENT_COLOR};
        }
      `}</style>

      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: CONTENT_COLOR }}>
        System Usability Scale (SUS)
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {susQuestions.map((question, index) => (
          <div key={index} style={{ border: '1px solid #e5e7eb', borderLeft: `6px solid ${PRIMARY_COLOR}`, borderRadius: '8px', padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', color: CONTENT_COLOR }}>
              {index + 1}. {question.label}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              {DefaultProps.map((prop, i) => (
                <label key={i} style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={prop.value}
                    {...form.register(question.field as any)}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: PRIMARY_COLOR }}
                  />
                  <span style={{ fontSize: '0.875rem', textAlign: 'center', maxWidth: '80px', color: CONTENT_COLOR, fontWeight: 500 }}>
                    {prop.label}
                  </span>
                </label>
              ))}
            </div>
            {errors[question.field as keyof typeof errors] && (
              <p style={{ color: ERROR_COLOR, marginTop: '1rem', fontSize: '0.875rem' }}>
                {errors[question.field as keyof typeof errors]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => form.reset()}
            className="sus-btn"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="sus-btn"
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
}
