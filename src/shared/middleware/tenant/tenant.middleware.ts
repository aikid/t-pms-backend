import { Injectable, NestMiddleware } from '@nestjs/common';
import { tenantContext } from '../../context/tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {

  use(req: any, res: any, next: () => void) {

    const user = req.user;

    tenantContext.run(
      {
        tenantId: user?.tenantId
      },
      () => next()
    );

  }

}