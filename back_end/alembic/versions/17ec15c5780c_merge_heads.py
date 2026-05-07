"""merge heads

Revision ID: 17ec15c5780c
Revises: d3036b0f9aab, 9fc0f6a974f5
Create Date: 2026-05-07 16:47:48.684691

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17ec15c5780c'
down_revision: Union[str, Sequence[str], None] = ('d3036b0f9aab', '9fc0f6a974f5')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
