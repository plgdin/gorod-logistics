import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SOPPage } from './SOPPage';
import { SOP_FULL_SECTIONS } from '../features/sop/sopFull';

describe('SOPPage full manual', () => {
  const html = renderToString(
    <MemoryRouter>
      <SOPPage />
    </MemoryRouter>,
  );

  it('renders every generated SOP section', () => {
    for (const section of SOP_FULL_SECTIONS) {
      expect(html).toContain(`id="${section.id}"`);
    }
  });

  it('includes the first receipt step and the final returns step', () => {
    expect(html).toContain('4.1.1');
    expect(html).toContain('Customer enquiry and Job Number creation');
    expect(html).toContain('4.4.5');
    expect(html).toContain('Filing Closure and Record Keeping');
  });

  it('offers the PDF and DOCX downloads', () => {
    expect(html).toContain('/sop/GL-BWH-SOP-01.pdf');
    expect(html).toContain('/sop/GL-BWH-SOP-01.docx');
  });
});
