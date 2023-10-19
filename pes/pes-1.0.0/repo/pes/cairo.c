/**
 * Copyright (C) <ano>  Chifrudo <chifrudo@localhost.com.br>
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou
 * modificá-lo sob os termos da GNU General Public License conforme
 * publicada por a Free Software Foundation, seja a versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; mesmo sem a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO PARA UM FIM ESPECÍFICO. Veja a
 * Licença Pública Geral GNU para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU General Public License
 * juntamente com este programa. Caso contrário, consulte
 * <https://www.gnu.org/licenses/>.
 */


#include <cairo/cairo.h>

#include "pes.h"


/**
 *
 */
#define X(stitch) (((stitch)->x - pes->min_x) * scale)

/**
 *
 */
#define Y(stitch) (((stitch)->y - pes->min_y) * scale)

/**
 *
 */
void output_cairo(struct pes *pes, const char *filename, int size, double density)
{
    int width  = pes->max_x - pes->min_x, outw;
    int height = pes->max_y - pes->min_y, outh;
    double scale = 1.0;

    cairo_surface_t *surface;
    cairo_t *cr;

    if (size > 0)
    {
        int maxd = width > height ? width : height;

        scale = (double) size / maxd;
    }

    outw = width * scale;
    outh = height * scale;

    surface = cairo_image_surface_create (CAIRO_FORMAT_ARGB32, outw + 1, outh + 1);
    cr = cairo_create (surface);

    for (struct pes_block *block = pes->blocks; block; block = block->next)
    {
        struct color *c = block->color;
        struct stitch *stitch = block->stitch;
        int i;

        if (!block->nr_stitches)
        {
            continue;
        }

        cairo_set_source_rgb(cr, c->r / 255.0, c->g / 255.0, c->b / 255.0);
        cairo_move_to(cr, X(stitch), Y(stitch));

        for (i = 1; i < block->nr_stitches; i++)
        {
            ++stitch;

            if (!stitch->jumpstitch)
            {
                cairo_line_to(cr, X(stitch), Y(stitch));
            } else
            {
                cairo_move_to(cr, X(stitch), Y(stitch));
            }
        }

        cairo_set_line_width(cr, scale * density);
        cairo_set_line_cap(cr, CAIRO_LINE_CAP_ROUND);
        cairo_set_line_join(cr, CAIRO_LINE_JOIN_ROUND);
        cairo_stroke(cr);
    }

    cairo_surface_write_to_png(surface, filename);
}
