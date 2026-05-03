import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  evaluationId: string;
  userId: string;
}

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

const DefaultProps = [
  { value: '5', label: 'Concordo Fortemente' },
  { value: '4', label: 'Concordo' },
  { value: '3', label: 'Neutro' },
  { value: '2', label: 'Discordo' },
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

export default function SusFormApp({ evaluationId, userId }: Props) {
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
    const event = new CustomEvent('sus-form-submitted', {
      detail: { values, evaluationId, userId },
      bubbles: true,
      composed: true,
    });
    // Dispara o evento a partir do elemento atual para que o host possa escutar
    window.dispatchEvent(event);
  };

  const { formState: { errors } } = form;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        System Usability Scale (SUS)
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {susQuestions.map((question, index) => (
          <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#f9fafb' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {index + 1}. {question.label}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              {DefaultProps.map((prop, i) => (
                <label key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={prop.value}
                    {...form.register(question.field as any)}
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', textAlign: 'center', maxWidth: '80px' }}>
                    {prop.label}
                  </span>
                </label>
              ))}
            </div>
            {errors[question.field as keyof typeof errors] && (
              <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.875rem' }}>
                {errors[question.field as keyof typeof errors]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => form.reset()}
            style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '1rem' }}
          >
            Limpar
          </button>
          <button
            type="submit"
            style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', background: '#4f46e5', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
}
