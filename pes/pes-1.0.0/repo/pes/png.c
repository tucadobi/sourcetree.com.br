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

#include <stdio.h>
#include <stdlib.h>
#include <png.h>

#include "pes.h"


/**
 *
 */
void output_png(struct pes *pes)
{
    int i;
    int width  = pes->max_x - pes->min_x + 1;
    int height = pes->max_y - pes->min_y + 1;
    int outw = 128, outh = 128;

    png_byte **rows;
    struct pes_block *block;

    png_structp png_ptr;
    png_infop info_ptr;
    rows = calloc(sizeof(*rows), outh);

    for (i = 0; i < outh; i++)
    {
        rows[i] = calloc(sizeof(png_byte) * 4, outw);
    }

    block = pes->blocks;
    while (block)
    {
        struct color *c = block->color;
        struct stitch *stitch = block->stitch;
        int i;

        for (i = 0; i < block->nr_stitches; i++, stitch++)
        {
            int x = (stitch->x - pes->min_x) * outw / width;
            int y = (stitch->y - pes->min_y) * outh / height;

            png_byte *ptr = rows[y] + x * 4;
            ptr[0] = c->r;
            ptr[1] = c->g;
            ptr[2] = c->b;
            ptr[3] = 255;
        }

        block = block->next;
    }

    png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    info_ptr = png_create_info_struct(png_ptr);

    png_init_io(png_ptr, stdout);
    png_set_IHDR(png_ptr, info_ptr, outw, outh, 8, PNG_COLOR_TYPE_RGBA, PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_BASE, PNG_FILTER_TYPE_BASE);
    png_write_info(png_ptr, info_ptr);
    png_write_image(png_ptr, rows);
    png_write_end(png_ptr, NULL);
}
